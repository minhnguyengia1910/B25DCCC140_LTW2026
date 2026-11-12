import { TIME_PER_QUESTION } from '../data';

const TimeBar = ({ timeLeft, frozen }) => (
  <div className="time-block">
    <p>{`Còn ${timeLeft} giây${frozen ? ' (đã dừng)' : ''}`}</p>
    <div className="time-track">
      <div role="progressbar" aria-label="Thời gian còn lại"
        aria-valuemin={0} aria-valuemax={TIME_PER_QUESTION} aria-valuenow={timeLeft}
        style={{ width: `${timeLeft / TIME_PER_QUESTION * 100}%`, backgroundColor: timeLeft <= 5 ? '#c0392b' : '#25834c' }} />
    </div>
  </div>
);

export default TimeBar;
