import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName }) => {
  const navigate = useNavigate();

  const handleStart = (event) => {
    event.preventDefault();
    if (!playerName.trim()) return;
    setPlayerName(playerName.trim());
    navigate('/play');
  };

  return (
    <section className="panel">
      <h1>Nhanh như chớp</h1>
      <p>Trả lời 15 câu hỏi về HTML, CSS, JavaScript và React.</p>
      <ul>
        <li>Mỗi câu có 15 giây. Sai hoặc hết giờ vẫn được chơi tiếp.</li>
        <li>Trả lời đúng được 50, 100 hoặc 150 điểm tùy mức độ.</li>
        <li>Mỗi giây còn lại được thưởng thêm 10 điểm nếu trả lời đúng.</li>
        <li>Đúng từ 5 / 9 / 13 câu được xếp loại tương ứng 1 / 2 / 3 sao.</li>
      </ul>
      <form onSubmit={handleStart} className="start-form">
        <label htmlFor="player-name">Tên người chơi</label>
        <input id="player-name" value={playerName} onChange={(event) => setPlayerName(event.target.value)} placeholder="Nhập tên của bạn" />
        <button className="primary" disabled={!playerName.trim()}>Bắt đầu</button>
      </form>
    </section>
  );
};

export default Home;
