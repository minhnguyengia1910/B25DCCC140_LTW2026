import { useState } from "react";
import StudentList from "./StudentList";
import "./App.css";

const duLieuMau = [
  { id: 1, name: "Nguyễn Văn A", score: 8.5, class: "D25CQCC01" },
  { id: 2, name: "Nguyễn Văn B", score: 3.5, class: "D25CQCC02" },
  { id: 3, name: "Nguyễn Văn C", score: 7, class: "D25CQCC03" },
];

const App = () => {
  const [students, setStudents] = useState(duLieuMau);
  const [filter, setFilter] = useState("all");
  const [newName, setNewName] = useState("");
  const [newScore, setNewScore] = useState("");
  const [newClass, setNewClass] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    const score = Number(newScore);

    if (newName.trim() === "" || newScore === "" || newClass.trim() === "") {
      setError("Vui lòng nhập đầy đủ họ tên, điểm số và lớp!");
      return;
    }
    if (isNaN(score) || score < 0 || score > 10) {
      setError("Điểm số phải từ 0 đến 10!");
      return;
    }

    const sinhVienMoi = {
      id: Date.now(),
      name: newName.trim(),
      score: score,
      class: newClass.trim(),
    };

    setStudents([...students, sinhVienMoi]);

    setNewName("");
    setNewScore("");
    setNewClass("");
    setError("");
  };

  const handleDelete = (id) => {
    setStudents(students.filter((sv) => sv.id !== id));
  };

  const filteredStudents = students.filter((sv) => {
    if (filter === "gioi") return sv.score >= 8;
    if (filter === "truot") return sv.score < 5;
    return true;
  });

  const total = students.length;
  const tongDiem = students.reduce((sum, sv) => sum + sv.score, 0);
  const average = total === 0 ? 0 : tongDiem / total;

  return (
    <div className="container">
      <h1>Quản lý Điểm Sinh viên</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Họ tên"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Điểm số"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lớp"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
        />
        <button onClick={handleAdd}>Thêm</button>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="filter">
        <button onClick={() => setFilter("all")}>Tất cả</button>
        <button onClick={() => setFilter("gioi")}>Loại Giỏi (≥ 8)</button>
        <button onClick={() => setFilter("truot")}>Trượt môn (&lt; 5)</button>
      </div>

      <p className="stats">
        {`Tổng số sinh viên: ${total} | Điểm trung bình: ${average.toFixed(2)}`}
      </p>

      <StudentList students={filteredStudents} onDelete={handleDelete} />
    </div>
  );
};

export default App;