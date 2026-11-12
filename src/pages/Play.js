import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Countdown from '../components/Countdown';
import QuestionCard from '../components/QuestionCard';
import TimeBar from '../components/TimeBar';
import ScorePanel from '../components/ScorePanel';
import { TIME_PER_QUESTION } from '../data';
import { calcPoints, calcTotal } from '../utils';

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const gameQuestions = questions.filter((question) => !question.reserve).sort((a, b) => a.id - b.id);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('countdown');
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [answers, setAnswers] = useState([]);
  const [chosen, setChosen] = useState(null);
  // Khóa ngay khi chọn để bấm liên tiếp không ghi đáp án hai lần.
  const answerLocked = useRef(false);
  const question = gameQuestions[index];
  const score = calcTotal(answers);
  const correctCount = answers.filter((answer) => answer.correct).length;

  const handleChoose = useCallback((option) => {
    if (status !== 'answering' || answerLocked.current) return;
    answerLocked.current = true;
    const correct = option !== null && option === question.answer;
    const points = correct ? calcPoints(question, timeLeft) : 0;
    setChosen(option);
    setAnswers((oldAnswers) => [...oldAnswers, {
      id: question.id, chosen: option, correct, timeLeft, points,
    }]);
    setStatus('revealed');
  }, [status, question, timeLeft]);

  // Đồng hồ chỉ chạy trong lúc đang trả lời.
  useEffect(() => {
    if (status !== 'answering') return;
    const timer = setInterval(() => {
      setTimeLeft((oldTime) => Math.max(0, oldTime - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [status, index]);

  useEffect(() => {
    if (status === 'answering' && timeLeft === 0) handleChoose(null);
  }, [status, timeLeft, handleChoose]);

  // Chờ 1,5 giây để xem đáp án rồi mới chuyển câu.
  useEffect(() => {
    if (status !== 'revealed') return;
    const timer = setTimeout(() => {
      if (index === gameQuestions.length - 1) {
        navigate('/result', {
          replace: true,
          state: { name: playerName, answers, score, correctCount },
        });
      } else {
        setIndex(index + 1);
        setTimeLeft(TIME_PER_QUESTION);
        setChosen(null);
        answerLocked.current = false;
        setStatus('answering');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [status, index, gameQuestions.length, playerName, answers, score, correctCount, navigate]);

  if (!playerName.trim()) return <Navigate to="/" replace />;
  if (status === 'countdown') return <Countdown onComplete={() => setStatus('answering')} />;

  return (
    <>
      <h1>Người chơi: {playerName}</h1>
      <ScorePanel score={score} correctCount={correctCount} lastPoints={status === 'revealed' ? answers[answers.length - 1].points : 0} />
      <TimeBar timeLeft={timeLeft} />
      <QuestionCard question={question} number={index + 1} total={gameQuestions.length}
        chosen={chosen} revealed={status === 'revealed'} onChoose={handleChoose} />
    </>
  );
};

export default Play;
