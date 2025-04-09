import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMovieById } from "../stores/slices/movieSlice";
import { addToWatchlist } from "../stores/slices/watchListSlice";

const FilmPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { movie, loading, error } = useSelector((state) => state.movie);

    useEffect(() => {
        dispatch(getMovieById(id));
    }, [id, dispatch]);

    if (loading) return <div className="text-center text-xl text-white py-10">Загрузка...</div>;
    if (error) return <div className="text-center text-red-500 text-lg py-10">Ошибка: {error}</div>;
    if (!movie) return <div className="text-center text-gray-400 py-10">Фильм не найден</div>;

    const addToWatched = () => {
        const data = { movieId: movie.id, runtime: movie.runtime, type: "done" };
        dispatch(addToWatchlist(data));
    };

    const addToWant = () => {
        const data = { movieId: movie.id, runtime: movie.runtime, type: "want" };
        dispatch(addToWatchlist(data));
    };

    console.log(movie);

    return (
        <div className="min-h-screen bg-dark text-white py-10 px-4">
            <div className="max-w-6xl mx-auto bg-gray-900 rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-10">
                
                {/* Poster Section */}
                <div className="md:w-1/3 relative">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="rounded-xl shadow-lg w-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-yellow-500 text-black text-sm font-semibold px-3 py-1 rounded-full shadow">
                        Оценка: {movie.vote_average.toFixed(1)}
                    </div>
                </div>

                {/* Info Section */}
                <div className="md:w-2/3 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        {movie.title} <span className="text-gray-400">({new Date(movie.release_date).getFullYear()})</span>
                    </h2>

                    <p className="text-gray-300 text-lg leading-relaxed">{movie.overview}</p>

                    <div className="space-y-2 text-sm text-gray-400">
                        <p><span className="font-semibold text-white">Дата выхода:</span> {movie.release_date}</p>
                        <p><span className="font-semibold text-white">Жанры:</span> {movie.genres.map(g => g.name).join(", ")}</p>
                        <p><span className="font-semibold text-white">Страна:</span> {movie.production_countries.map(c => c.name).join(", ")}</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <button
                            onClick={addToWatched}
                            className="px-5 py-2 bg-green-600 hover:bg-green-700 transition rounded-full font-semibold text-white shadow"
                        >
                            Посмотрел
                        </button>
                        <button
                            onClick={addToWant}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-full font-semibold text-white shadow"
                        >
                            Хочу посмотреть
                        </button>
                        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 transition rounded-full font-semibold text-white shadow">
                            ...
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilmPage;
