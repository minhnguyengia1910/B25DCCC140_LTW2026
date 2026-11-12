import { LETTERS } from '../data';

const AnswerButton = ({ option, index, answer, chosen, revealed, onChoose }) => {
  let className = 'answer-button';
  if (revealed && index === answer) className += ' correct';
  if (revealed && index === chosen && index !== answer) className += ' wrong';

  return (
    <button className={className} disabled={revealed} onClick={() => onChoose(index)}>
      <b>{LETTERS[index]}.</b> {option}
    </button>
  );
};

export default AnswerButton;
