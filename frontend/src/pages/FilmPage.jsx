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

  console.log(movie); 

  const addToWatched = () => {
    const data = { movieId: movie.id, runtime: movie.runtime, type: "done" };
    dispatch(addToWatchlist(data));
  };

  const addToWant = () => {
    const data = { movieId: movie.id, runtime: movie.runtime, type: "want" };
    dispatch(addToWatchlist(data));
  };

  return (
    <div className="min-h-screen bg-dark text-white py-10 px-4">
      <div className="max-w-6xl mx-auto bg-gray-900 rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-10">
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

        <div className="md:w-2/3 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {movie.title} <span className="text-gray-400">({new Date(movie.release_date).getFullYear()})</span>
          </h2>


          {movie.tagline && (
            <p className="italic text-gray-400">{movie.tagline}</p>
          )}

          <p className="text-gray-300 text-lg leading-relaxed">{movie.overview}</p>

          <div className="space-y-2 text-sm text-gray-400">
            <p><span className="font-semibold text-white">Дата выхода:</span> {movie.release_date}</p>
            <p><span className="font-semibold text-white">Жанры:</span> {movie.genres.map(g => g.name).join(", ")}</p>
            <p><span className="font-semibold text-white">Страны:</span> {movie.production_countries.map(c => c.name).join(", ")}</p>
            <p><span className="font-semibold text-white">Студии:</span> {movie.production_companies.map(c => c.name).join(", ")}</p>
            <p><span className="font-semibold text-white">Бюджет:</span> {movie.budget ? `$${movie.budget.toLocaleString()}` : "Неизвестно"}</p>
            <p><span className="font-semibold text-white">Кассовые сборы:</span> {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "Неизвестно"}</p>
            <p><span className="font-semibold text-white">Длительность:</span> {movie.runtime} минут</p>
            <p><span className="font-semibold text-white">Языки:</span> {movie.spoken_languages.map(l => l.name).join(", ")}</p>
          </div>


          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Актеры</h3>
            <div className="flex flex-wrap gap-4">
              {movie.cast && movie.cast.length > 0 ? (
                movie.cast.slice(0, 5).map(actor => (
                  <div key={actor.id} className="text-center">
                    <img
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "/path/to/default-image.jpg"}
                      alt={actor.name}
                      className="w-24 h-24 object-cover rounded-full mx-auto"
                    />
                    <p className="text-sm text-gray-300 mt-2">{actor.name}</p>
                    <p className="text-xs text-gray-500">{actor.character}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Актеры не найдены.</p>
              )}
            </div>
          </div>

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