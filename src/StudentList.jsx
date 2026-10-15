import StudentItem from "./StudentItem";

const StudentList = ({ students, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Họ tên</th>
          <th>Điểm</th>
          <th>Lớp</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan="5">Không có sinh viên nào</td>
          </tr>
        ) : (
          students.map((student, index) => (
            <StudentItem
              key={student.id}
              student={student}
              stt={index + 1}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default StudentList;