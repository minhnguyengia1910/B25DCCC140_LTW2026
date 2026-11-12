import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LETTERS } from '../data';
import { getStars } from '../utils';

const Result = ({ questions, setPlayerName }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  if (!state || !Array.isArray(state.answers)) return <Navigate to="/" replace />;
  const { name, answers, score, correctCount } = state;
  const rating = getStars(correctCount);

  const handleReplay = () => {
    setPlayerName(name);
    navigate('/play');
  };

  return (
    <section className="panel">
      <h1>{rating.message}</h1>
      <p>Người chơi: <b>{name}</b></p>
      <p>{`Số câu trả lời đúng: ${correctCount}/15`}</p>
      <p>Điểm: <b>{score}</b></p>
      <p>{`Xếp loại: ${rating.stars} sao `}<span className="stars">{`${'★'.repeat(rating.stars)}${'☆'.repeat(3 - rating.stars)}`}</span></p>
      <h2>Xem lại</h2>
      <div className="table-scroll">
        <table>
          <thead><tr><th>Câu</th><th>Bạn chọn</th><th>Đáp án đúng</th><th>Còn lại</th><th>Điểm</th></tr></thead>
          <tbody>{answers.map((answer, index) => {
            const question = questions.find((item) => item.id === answer.id);
            return (
              <tr key={answer.id} className={answer.correct ? 'correct' : 'wrong'}>
                <td>{`Câu ${index + 1}${answer.originalId && answer.id !== answer.originalId ? ` (đổi sang câu ${answer.id})` : ''}`}</td>
                <td>{answer.chosen === null ? '—' : LETTERS[answer.chosen]}</td>
                <td>{LETTERS[question.answer]}</td>
                <td>{`${answer.timeLeft} giây`}</td><td>{answer.points}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      <div className="actions"><button className="primary" onClick={handleReplay}>Chơi lại</button><Link to="/">Về trang chủ</Link></div>
    </section>
  );
};

export default Result;
