const PowerUps = ({ used, answering, doubled, onSwap, onDouble, onFreeze }) => (
  <div className="power-ups">
    <button disabled={!answering || used.swap} onClick={onSwap}>Đổi câu hỏi</button>
    <button disabled={!answering || used.double} onClick={onDouble}>{doubled ? 'Đang nhân đôi' : 'Nhân đôi'}</button>
    <button disabled={!answering || used.freeze} onClick={onFreeze}>Dừng giờ</button>
  </div>
);

export default PowerUps;
