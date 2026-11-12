import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions }) => {
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('id');
  const [keyword, setKeyword] = useState('');

  const handleKeywordShift = (event) => setKeyword(event.target.value);

  const filtered = questions.filter((question) => {
    const matchType = type === 'all' || (type === 'reserve' ? question.reserve : !question.reserve);
    return matchType && question.question.toLowerCase().includes(keyword.toLowerCase());
  });
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'easy') return a.level - b.level || a.id - b.id;
    if (sort === 'hard') return b.level - a.level || a.id - b.id;
    return a.id - b.id;
  });

  return (
    <section className="panel">
      <h1>Ngân hàng câu hỏi</h1>
      <div className="filters">
        <button className={type === 'all' ? 'selected' : ''} onClick={() => setType('all')}>{`Tất cả (${questions.filter(() => true).length})`}</button>
        <button className={type === 'official' ? 'selected' : ''} onClick={() => setType('official')}>{`Chính thức (${questions.filter((q) => !q.reserve).length})`}</button>
        <button className={type === 'reserve' ? 'selected' : ''} onClick={() => setType('reserve')}>{`Dự bị (${questions.filter((q) => q.reserve).length})`}</button>
      </div>
      <div className="toolbar">
        <label>Sắp xếp
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="id">Theo số thứ tự</option>
            <option value="easy">Mức độ: Dễ → Khó</option>
            <option value="hard">Mức độ: Khó → Dễ</option>
          </select>
        </label>
        <label>Tìm kiếm
          <input value={keyword} onChange={handleKeywordShift} placeholder="Nội dung câu hỏi" />
        </label>
      </div>
      <p>{`Có ${sorted.length} câu hỏi`}</p>
      <div className="table-scroll">
        <table>
          <thead><tr><th>STT</th><th>Mức độ</th><th>Loại</th><th>Câu hỏi</th></tr></thead>
          <tbody>
            {sorted.map((question) => (
              <tr key={question.id}>
                <td>{question.id}</td><td>{LEVELS[question.level]}</td>
                <td>{question.reserve ? 'Dự bị' : 'Chính thức'}</td>
                <td><Link to={`/questions/${question.id}`}>{question.question}</Link></td>
              </tr>
            ))}
            {sorted.length === 0 && <tr><td colSpan={4}>Không có câu hỏi phù hợp.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default QuestionBank;
