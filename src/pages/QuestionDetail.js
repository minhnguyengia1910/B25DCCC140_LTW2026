import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS, LEVELS } from '../data';

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAnswer, setShowAnswer] = useState(false);
  const question = questions.find((item) => item.id === Number(id));

  useEffect(() => setShowAnswer(false), [id]);

  return (
    <section className="panel">
      {!question ? <h1>Không tìm thấy câu hỏi</h1> : <>
        <h1>{`Câu hỏi số ${question.id} – ${LEVELS[question.level]} · ${question.reserve ? 'Dự bị' : 'Chính thức'}`}</h1>
        <h2>{question.question}</h2>
        <div className="option-list">
          {question.options.map((option, index) => (
            <p key={index} className={showAnswer && index === question.answer ? 'correct' : ''}>
              {`${LETTERS[index]}. ${option}${showAnswer && index === question.answer ? ' (Đáp án đúng)' : ''}`}
            </p>
          ))}
        </div>
        {showAnswer && <p><b>Giải thích:</b> {question.explain}</p>}
        <button className="primary" onClick={() => setShowAnswer(!showAnswer)}>{showAnswer ? 'Ẩn đáp án' : 'Xem đáp án'}</button>
      </>}
      <button className="back-button" onClick={() => navigate(-1)}>Quay lại</button>
    </section>
  );
};

export default QuestionDetail;
