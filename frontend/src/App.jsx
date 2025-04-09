import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent.jsx';
import FooterComponent from "./components/FooterComponent";
import HomePage from './pages/HomePage.jsx';
import FilmPage from './pages/FilmPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/ProfilePage.jsx';

const App = () => {

  return (
    <Router>
      <div>
        <HeaderComponent />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/details/:id" element={<FilmPage />} />

          {<Route path="/login" element={<Login />}  /> }
          {<Route path="/register" element={<Register />}  /> }
          {<Route path="/profile" element={<Profile />}  /> }
        </Routes>

        <FooterComponent />
      </div>
    </Router>
  );
};

export default App;
