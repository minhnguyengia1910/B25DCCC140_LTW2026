import { LEVELS } from '../data';
import AnswerButton from './AnswerButton';

const QuestionCard = ({ question, number, total, chosen, revealed, onChoose }) => (
  <section className="panel">
    <p className="question-number">{`Câu ${number}/${total} · ${LEVELS[question.level]}`}</p>
    <h2>{question.question}</h2>
    <div className="answers">
      {question.options.map((option, index) => (
        <AnswerButton key={index} option={option} index={index} answer={question.answer}
          chosen={chosen} revealed={revealed} onChoose={onChoose} />
      ))}
    </div>
  </section>
);

export default QuestionCard;
