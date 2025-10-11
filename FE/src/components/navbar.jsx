import '../assets/dataSencor.scss';
import { Link, NavLink } from 'react-router-dom';
function NavBar(){

    return (
        <nav className="navbar">
        <NavLink className="nav-item" to={'/'}>Trang chủ</NavLink>
        <NavLink className="nav-item" to={'/data'}>Dữ liệu cảm biến</NavLink>
        <NavLink className="nav-item" to={'/history'}>Lịch sử</NavLink>
        <NavLink className="nav-item" to={'/profile'}>Hồ sơ</NavLink>
      </nav>
    )
}
export default NavBar;