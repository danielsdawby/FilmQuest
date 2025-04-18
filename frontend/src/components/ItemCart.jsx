import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieItem = ({ movie, isGrid }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/details/${movie.id}`); 
    };

    return (
        <div 
            className={`
                flex flex-col bg-gray-100 dark:bg-accent p-5 rounded-xl shadow-md hover:shadow-lg 
                transition-colors duration-300 cursor-pointer
                ${isGrid ? '' : 'max-w-md mx-auto'} 
            `} 
            onClick={handleClick}
        >
            <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
                className={`
                    w-full rounded-md 
                    ${isGrid ? '' : 'max-h-[400px] object-contain'}
                `}
            />
            <div className="mt-2">
                <h3 className="font-bold text-center text-gray-900 dark:text-white">{movie.title}</h3>
            </div>
        </div>
    );
};

export default MovieItem;
