import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Countdown from '../components/Countdown';
import QuestionCard from '../components/QuestionCard';
import TimeBar from '../components/TimeBar';
import ScorePanel from '../components/ScorePanel';
import PowerUps from '../components/PowerUps';
import { TIME_PER_QUESTION } from '../data';
import { calcPoints, calcTotal, getStars } from '../utils';

const Play = ({ questions, playerName, addHistory }) => {
  const navigate = useNavigate();
  const gameQuestions = questions.filter((question) => !question.reserve).sort((a, b) => a.id - b.id);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('countdown');
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [answers, setAnswers] = useState([]);
  const [chosen, setChosen] = useState(null);
  const [replacement, setReplacement] = useState(null);
  const [used, setUsed] = useState({ swap: false, double: false, freeze: false });
  const [doubled, setDoubled] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [pointed, setPointed] = useState(0);
  // Khóa ngay khi chọn để bấm liên tiếp không ghi đáp án hai lần.
  const answerLocked = useRef(false);
  const question = replacement || gameQuestions[index];
  const originalId = gameQuestions[index].id;
  const score = calcTotal(answers);
  const correctCount = answers.filter((answer) => answer.correct).length;

  const handleChoose = useCallback((option) => {
    if (status !== 'answering' || answerLocked.current) return;
    answerLocked.current = true;
    const correct = option !== null && option === question.answer;
    const points = correct ? calcPoints(question, timeLeft) * (doubled ? 2 : 1) : 0;
    setChosen(option);
    setAnswers((oldAnswers) => [...oldAnswers, {
      id: question.id, originalId, chosen: option, correct, timeLeft, points,
    }]);
    setStatus('revealed');
  }, [status, question, originalId, timeLeft, doubled]);

  // Đồng hồ chỉ chạy trong lúc đang trả lời.
  useEffect(() => {
    if (status !== 'answering' || frozen) return;
    const timer = setInterval(() => {
      setTimeLeft((oldTime) => Math.max(0, oldTime - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [status, index, frozen, replacement]);

  useEffect(() => {
    if (status === 'answering' && timeLeft === 0) handleChoose(null);
  }, [status, timeLeft, handleChoose]);

  // Chờ 1,5 giây để xem đáp án rồi mới chuyển câu.
  useEffect(() => {
    if (status !== 'revealed') return;
    const timer = setTimeout(() => {
      if (index === gameQuestions.length - 1) {
        addHistory({
          id: Date.now(), name: playerName, score, correctCount,
          stars: getStars(correctCount).stars,
          playedAt: new Date().toLocaleString('vi-VN'),
        });
        navigate('/result', {
          replace: true,
          state: { name: playerName, answers, score, correctCount },
        });
      } else {
        setIndex(index + 1);
        setTimeLeft(TIME_PER_QUESTION);
        setChosen(null);
        setReplacement(null);
        setDoubled(false);
        setFrozen(false);
        setPointed(0);
        answerLocked.current = false;
        setStatus('answering');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [status, index, gameQuestions.length, playerName, answers, score, correctCount, navigate, addHistory]);

  useEffect(() => {
    if (status !== 'answering') return;
    const handleKey = (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'ArrowLeft' && pointed % 2 === 1) setPointed(pointed - 1);
      if (event.key === 'ArrowRight' && pointed % 2 === 0) setPointed(pointed + 1);
      if (event.key === 'ArrowUp' && pointed >= 2) setPointed(pointed - 2);
      if (event.key === 'ArrowDown' && pointed < 2) setPointed(pointed + 2);
      if (event.key === 'Enter') handleChoose(pointed);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, pointed, handleChoose]);

  useEffect(() => {
    document.title = `Câu ${index + 1}/15 – đúng ${correctCount} câu`;
    return () => { document.title = 'Nhanh như chớp'; };
  }, [index, correctCount]);

  const handleSwap = () => {
    if (status !== 'answering' || used.swap) return;
    const reserve = questions.find((item) => item.reserve && item.level === question.level);
    if (!reserve) return;
    setReplacement(reserve);
    setTimeLeft(TIME_PER_QUESTION);
    setPointed(0);
    setUsed({ ...used, swap: true });
  };

  const handleDouble = () => {
    if (status !== 'answering' || used.double) return;
    setDoubled(true);
    setUsed({ ...used, double: true });
  };

  const handleFreeze = () => {
    if (status !== 'answering' || used.freeze) return;
    setFrozen(true);
    setUsed({ ...used, freeze: true });
  };

  if (!playerName.trim()) return <Navigate to="/" replace />;
  if (status === 'countdown') return <Countdown onComplete={() => setStatus('answering')} />;

  return (
    <>
      <h1>Người chơi: {playerName}</h1>
      <ScorePanel score={score} correctCount={correctCount} lastPoints={status === 'revealed' ? answers[answers.length - 1].points : 0} />
      <TimeBar timeLeft={timeLeft} frozen={frozen} />
      <QuestionCard question={question} number={index + 1} total={gameQuestions.length}
        chosen={chosen} revealed={status === 'revealed'} pointed={pointed} onChoose={handleChoose} />
      <PowerUps used={used} answering={status === 'answering'} doubled={doubled}
        onSwap={handleSwap} onDouble={handleDouble} onFreeze={handleFreeze} />
      <p className="hint">Dùng phím mũi tên để di chuyển, Enter để chọn đáp án.</p>
    </>
  );
};

export default Play;
