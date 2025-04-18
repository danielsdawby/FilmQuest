import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchMovies, clearSearch } from "../stores/slices/movieSlice";
import { checkAuth, logout } from "../stores/slices/authSlice";
import Logo from "./Logo";
import SearchIcon from "../assets/images/seachIcon.svg";
import Logout from "../assets/images/logout.svg";
import Profile from "../assets/images/profile.svg";
import Login from "../assets/images/login.svg";
import ThemeToggle from "./ThemeToggle";

const HeaderComponent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchResults = useSelector((state) => state.movie.searchResults);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 0) {
            dispatch(searchMovies(e.target.value));
            setIsDropdownOpen(true);
        } else {
            dispatch(clearSearch());
            setIsDropdownOpen(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            dispatch(searchMovies(searchTerm));
            setIsDropdownOpen(true);
        }
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleRedirectHome = () => {
        navigate("/");
    };

    const handleProfileClick = () => {
        navigate("/profile");
    };

    const handleLogoutClick = () => {
        dispatch(logout());
    };

    const handleResultClick = (id) => {
        navigate(`/details/${id}`);
        setSearchTerm("");
        setIsDropdownOpen(false);
        dispatch(clearSearch());
    };

    return (
            <div className="bg-white dark:bg-dark transition-colors duration-300">
              <header className="container flex justify-between items-center p-4">
                <div onClick={handleRedirectHome} className="cursor-pointer">
                  <Logo />
                </div>

                <div className="search w-96" ref={searchRef}>
                    <form
                        onSubmit={handleSearch}
                        className="relative flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md  transition-colors duration-200"
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            placeholder="Search for movies..."
                            className="search-input text-gray-900 dark:text-white bg-transparent w-full py-2 px-3 rounded-xl focus:outline-none"
                        />
                        <button type="submit" className="absolute right-2">
                            <img src={SearchIcon} alt="Search" className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </button>
                        {isDropdownOpen && searchResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                                <ul>
                                    {searchResults.map((result) => (
                                        <li
                                            key={result.id}
                                            onClick={() => handleResultClick(result.id)}
                                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer flex items-center"
                                        >
                                            {result.poster_path && (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                                                    alt={result.title}
                                                    className="mr-2 w-10 h-14 object-cover rounded"
                                                />
                                            )}
                                            <span>{result.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </form>
                </div>

                <div className="flex gap-5 items-center">
                    <ThemeToggle />
                    {user ? (
                        <>
                            <button className="" onClick={handleProfileClick}><img src={Profile} alt="Profile" /></button>
                            <button className="" onClick={handleLogoutClick}><img src={Logout} alt="Profile" /></button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleLoginClick}>
                                <img src={Login} alt="login" />
                            </button>
                        </>
                    )}
                </div>
            </header>
        </div>
    );
};

export default HeaderComponent;
