import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';  
import { searchMovies } from '../stores/slices/movieSlice'; 
import { checkAuth, logout } from '../stores/slices/authSlice';
import Logo from '../assets/images/logo.svg';
import SearchIcon from '../assets/images/seachIcon.svg';
import Logout from '../assets/images/logout.svg';
import Profile from '../assets/images/profile.svg';
import Login from '../assets/images/login.svg';

const HeaderComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const user = useSelector((state) => state.auth.user); 

  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await dispatch(searchMovies(searchTerm));
      setSearchTerm('');
    }
  };

  const handleLoginClick = () => {
    navigate('/login'); 
  };

  const handleRedirectHome = () => {
    navigate('/'); 
  };

  const handleProfileClick = () => {
    navigate('/profile'); 
  };

  const handleLogoutClick = () => {
    dispatch(logout()); 
  };

  return (
    <div className="bg-dark">
      <header className="container flex justify-between items-center p-4">
        <div onClick={handleRedirectHome} className="cursor-pointer">
          <img src={Logo} alt="logo" />
        </div>
        
        <div className="search">
          <form onSubmit={handleSearch} className="flex justify-center bg-white border-dark p-1 px-3 rounded-xl max-w-[400px] w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search for movies..."
              className="search-input"
            />
            <button type="submit" className="search-button"><img src={SearchIcon} alt="logo" /></button>
          </form>
        </div>

        <div className="flex gap-5">
          {user ? (
            <>
              <button className="" onClick={handleProfileClick}><img src={Profile} alt="Profile" /></button>
              <button className="" onClick={handleLogoutClick}><img src={Logout} alt="Profile" /></button>
            </>
          ) : (
            <>
              <button onClick={handleLoginClick}><img src={Login} alt="login" /></button>
            </>
          )}
        </div>
      </header>
    </div>
  );
};

export default HeaderComponent;
