import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieItem = ({ movie }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/details/${movie.id}`); 
    };

    return (
        <div className="flex flex-col bg-accent p-5 rounded-xl" onClick={handleClick}>
            <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
                className="w-full"
            />
            <div className="mt-2">
                <h3 className="font-bold text-center">{movie.title}</h3>
            </div>
        </div>
    );
};

export default MovieItem;
