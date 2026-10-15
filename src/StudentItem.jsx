const StudentItem = ({ student, stt, onDelete }) => {
  const { id, name, score, class: lop } = student;

  const mauDiem = score >= 8 ? "diem-gioi" : score < 5 ? "diem-truot" : "";

  return (
    <tr>
      <td>{stt}</td>
      <td>{name}</td>
      <td className={mauDiem}>{score}</td>
      <td>{lop}</td>
      <td>
        <button onClick={() => onDelete(id)} title={`Xóa ${name}`}>
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default StudentItem;