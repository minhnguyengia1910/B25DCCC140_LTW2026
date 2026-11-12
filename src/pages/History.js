const History = ({ history, setHistory }) => {
  const sorted = [...history].sort((a, b) => b.score - a.score || b.correctCount - a.correctCount);
  const totalScore = history.reduce((total, item) => total + item.score, 0);
  const totalCorrect = history.reduce((total, item) => total + item.correctCount, 0);

  return (
    <section className="panel">
      <h1>Lịch sử các lượt chơi</h1>
      <p>{`Số lượt chơi: ${history.length}`}</p>
      <p>{`Điểm trung bình: ${history.length ? Math.round(totalScore / history.length) : 0}`}</p>
      <p>{`Tỉ lệ trả lời đúng: ${history.length ? Math.round(totalCorrect / (15 * history.length) * 100) : 0}%`}</p>
      <button className="danger" disabled={!history.length} onClick={() => setHistory([])}>Xóa lịch sử</button>
      {!history.length ? <p>Chưa có lượt chơi nào.</p> : (
        <div className="table-scroll">
          <table>
            <thead><tr><th>Người chơi</th><th>Số câu đúng</th><th>Xếp loại</th><th>Điểm</th><th>Thời gian</th><th>Thao tác</th></tr></thead>
            <tbody>{sorted.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td><td>{`${item.correctCount}/15`}</td>
                <td className="stars">{`${'★'.repeat(item.stars)}${'☆'.repeat(3 - item.stars)}`}</td>
                <td>{item.score}</td><td>{item.playedAt}</td>
                <td><button className="danger" onClick={() => setHistory(history.filter((record) => record.id !== item.id))}>Xóa</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default History;
