const StudentItem = ({ student, stt, onDelete }) => {
  const { id, name, score, class: lop } = student;

  return (
    <tr>
      <td>{stt}</td>
      <td>{name}</td>
      <td>{score}</td>
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