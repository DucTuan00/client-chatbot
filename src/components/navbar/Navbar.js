import React, { useState, useEffect } from 'react'
import "./Navbar.css"
import { Link, useNavigate } from 'react-router-dom';


const Navbar = ({ userName, onUserLogin }) => {
  const [currentDate, setCurrentDate] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0'); // Ngày
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng
      const year = now.getFullYear(); // Năm    
      // Mảng chứa tên các thứ
      const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const weekday = weekdays[now.getDay()]; // Lấy thứ
      const dateString = `${weekday}, ${day}/${month}/${year}`; // Định dạng thứ, ngày/tháng/năm
      setCurrentDate(dateString);
    };
    updateDate(); // Cập nhật ngay khi load
    const interval = setInterval(updateDate, 1000 * 60); // Cập nhật mỗi phút
    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Chuyển hướng đến trang đăng nhập sau khi đăng xuất
    onUserLogin(null); // Reset username on logout
  };


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          {/* <div class="top">
            <img src={logo} alt="Logo" style={{ width: '100px', height: '50px', marginRight: '5px' }} class="img-logo"></img>
          </div> */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/home" className="nav-link text-white" aria-current="page" 
                style={{ fontFamily: '"Playwrite DE Grund", cursive', fontStyle: 'bold' }}>Home</Link>
              </li>
            </ul>
            <div className="d-flex align-items-center custom-gap ms-auto">
              <div className="d-flex flex-column me-3">
                <span className="text-white" style={{ fontFamily: '"Playwrite DE Grund", cursive' }}>{currentDate}</span>
              </div>
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-center custom-gap">
              <Link to="./login">
                <button className="btn btn-outline-danger text-white" type="button" style={{ fontFamily: '"Playwrite DE Grund", cursive' }}>
                  <span className="bi-person-circle"></span> Login
                </button>
              </Link>
          </div>
          {/* thời tiết */}
        </div>
      </nav>
    </>
  )
}

export default Navbar
