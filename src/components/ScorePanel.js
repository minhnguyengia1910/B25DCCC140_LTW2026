const ScorePanel = ({ score, correctCount, lastPoints }) => (
  <div className="score-panel">
    <p>Điểm: <b>{score}</b></p>
    <p>Số câu đúng: <b>{correctCount}</b></p>
    {lastPoints > 0 && <p className="bonus">{`+${lastPoints} điểm`}</p>}
  </div>
);

export default ScorePanel;
