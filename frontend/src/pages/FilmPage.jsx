import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMovieById } from "../stores/slices/movieSlice";
import { addToWatchlist } from "../stores/slices/watchListSlice";
import { removeFromWatchlist } from "../stores/slices/watchListSlice";
import { getWatchList } from "../stores/slices/watchListSlice";
import NoteModal from "../components/NoteModal";
import { Link } from "react-router-dom";

const FilmPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { movie, loading, error } = useSelector((state) => state.movie);
  const { watchlist } = useSelector((state) => state.watchlist);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const isInWatchlist = watchlist.some((item) => item.movieId === movie?.id);
  const currentWatchlistItem = watchlist.find((item) => item.movieId === id);

  console.log(movie);

  useEffect(() => {
    dispatch(getMovieById(id));
    dispatch(getWatchList());
  }, [id, dispatch]);

  const addToWatched = async () => {
    const data = { movieId: movie.id, runtime: movie.runtime, type: "done" };
    await dispatch(addToWatchlist(data));
    await dispatch(getWatchList());
  };

  const addToWant = async () => {
    const data = { movieId: movie.id, runtime: movie.runtime, type: "want" };
    await dispatch(addToWatchlist(data));
    await dispatch(getWatchList());
  };

  const handleRemoveFromWatchlist = async () => {
    await dispatch(removeFromWatchlist(movie.id));
    await dispatch(getWatchList());
  };

  const openNoteModal = () => {
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setIsNoteModalOpen(false);
  };

  if (loading)
    return (
      <div className="text-center text-xl text-gray-900 dark:text-white py-10 bg-white dark:bg-dark transition-colors duration-300">
        Загрузка...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 text-lg py-10 bg-white dark:bg-dark transition-colors duration-300">
        Ошибка: {error}
      </div>
    );
  if (!movie)
    return (
      <div className="text-center text-gray-400 py-10 bg-white dark:bg-dark transition-colors duration-300">
        Фильм не найден
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-dark text-gray-900 dark:text-white py-10 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-10 transition-colors duration-300">
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {movie.title} <span className="text-gray-500 dark:text-gray-400">({new Date(movie.release_date).getFullYear()})</span>
          </h2>

          {movie.tagline && <p className="italic text-gray-600 dark:text-gray-400">{movie.tagline}</p>}

          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{movie.overview}</p>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Дата выхода:</span> {movie.release_date}
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Жанры:</span>{" "}
              {movie.genres.map((g) => g.name).join(", ")}
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Страны:</span>{" "}
              {movie.production_countries.map((c) => c.name).join(", ")}
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Студии:</span>{" "}
              {movie.production_companies.map((c) => c.name).join(", ")}
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Бюджет:</span>{" "}
              {movie.budget ? `$${movie.budget.toLocaleString()}` : "Неизвестно"}
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Кассовые сборы:</span>{" "}
              {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "Неизвестно"}
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Длительность:</span> {movie.runtime} минут
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Языки:</span>{" "}
              {movie.spoken_languages.map((l) => l.name).join(", ")}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Актеры</h3>
            <div className="flex flex-wrap gap-4">
              {movie.cast && movie.cast.length > 0 ? (
                movie.cast.map((actor) => (
                  <div key={actor.id} className="text-center">
                    <Link to={`/actor/${actor.id}`}>
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                            : "/path/to/default-image.jpg"
                        }
                        alt={actor.name}
                        className="w-24 h-24 object-cover rounded-full mx-auto cursor-pointer"
                      />
                    </Link>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{actor.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{actor.character}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Актеры не найдены.</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {!isInWatchlist && (
              <>
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
              </>
            )}

            {isInWatchlist && (
              <>
                <button
                  onClick={handleRemoveFromWatchlist}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 transition rounded-full font-semibold text-white shadow"
                >
                  Удалить из списка
                </button>
              </>
            )}
            <button
              onClick={openNoteModal}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 transition rounded-full font-semibold text-black shadow"
            >
              {currentWatchlistItem?.note ? "Редактировать заметку" : "Добавить заметку"}
            </button>
          </div>
        </div>
      </div>
      {isNoteModalOpen && <NoteModal movieId={id} onClose={closeNoteModal} existingNote={currentWatchlistItem?.note} />}
    </div>
  );
};

export default FilmPage;
