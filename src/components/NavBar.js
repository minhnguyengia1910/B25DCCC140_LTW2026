import { NavLink } from 'react-router-dom';

const NavBar = () => (
  <header className="header">
    <div className="nav-content">
      <span className="brand">Nhanh như chớp</span>
      <nav aria-label="Menu chính">
        <NavLink to="/" end>Trang chủ</NavLink>
        <NavLink to="/questions">Ngân hàng câu hỏi</NavLink>
        <NavLink to="/history">Lịch sử</NavLink>
      </nav>
    </div>
  </header>
);

export default NavBar;
