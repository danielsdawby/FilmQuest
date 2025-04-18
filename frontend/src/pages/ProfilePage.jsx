import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getWatchList } from "../stores/slices/watchListSlice";
import { getMovieById } from "../stores/slices/movieSlice";
import { getMovieNotes, deleteMovieNote } from "../stores/slices/noteSlice";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const watchlist = useSelector((state) => state.watchlist.watchlist);
  const movies = useSelector((state) => state.movie.movies);
  const notes = useSelector((state) => state.notes.notes);
  const dispatch = useDispatch();
  const [isWantToWatchOpen, setIsWantToWatchOpen] = useState(false);
  const [isWatchedOpen, setIsWatchedOpen] = useState(false);

  useEffect(() => {
    dispatch(getWatchList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMovieNotes(user._id));
  }, [dispatch, user._id]);

  useEffect(() => {
    watchlist.forEach((item) => {
      if (!movies[item.movieId]) {
        dispatch(getMovieById(item.movieId));
      }
    });
  }, [watchlist, dispatch, movies]);

  const wantToWatch = watchlist.filter((item) => item.type === "want");
  const watched = watchlist.filter((item) => item.type === "done");

  const totalRuntime = watched.reduce((total, item) => {
    const movie = movies[item.movieId];
    return movie ? total + movie.runtime : total;
  }, 0);

  const toggleWantToWatch = () => {
    setIsWantToWatchOpen(!isWantToWatchOpen);
  };

  const toggleWatched = () => {
    setIsWatchedOpen(!isWatchedOpen);
  };

  const handleDeleteNote = (noteId) => {
    dispatch(deleteMovieNote(noteId));
  };

  return (
    <div className="bg-white dark:bg-dark transition-colors duration-300 min-h-screen">
      <div className="container min-h-[calc(100vh-64px-75px)] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gray-100 dark:bg-accent text-gray-900 dark:text-white shadow-lg rounded-2xl p-8 transition-colors duration-300 mb-24">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Профиль пользователя
          </h1>

          <div className="space-y-4 mb-10">
            <p className="text-lg">
              <span className="font-semibold">Никнейм:</span> {user?.email}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Кол-во просмотренных минут:</span>{" "}
              {totalRuntime} мин
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Мои заметки</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {notes && notes.length > 0 ? (
                notes.map((note) => {
                  const movie = movies[note.movieId];
                  return (
                    movie && (
                      <div
                        key={note._id}
                        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                      >
                        <Link to={`/details/${movie.id}`}>
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-64 object-cover rounded-md mb-4"
                          />
                        </Link>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {movie.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {note.note}
                        </p>
                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                        >
                          Удалить
                        </button>
                      </div>
                    )
                  );
                })
              ) : (
                <p className="text-gray-600 dark:text-gray-400">Нет заметок.</p>
              )}
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center mb-4 space-x-2">
              <h2 className="text-2xl font-semibold">Хочу посмотреть:</h2>
              <button
                onClick={toggleWantToWatch}
                className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 transition duration-300 text-sm"
              >
                {isWantToWatchOpen ? "Скрыть" : "Показать"}
              </button>
            </div>
            <div
              className={`grid gap-6 sm:grid-cols-2 md:grid-cols-3 transition-all duration-500 overflow-hidden ${
                isWantToWatchOpen
                  ? "max-h-full opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {wantToWatch.length > 0 ? (
                wantToWatch.map((item) => {
                  const movie = movies[item.movieId];
                  return (
                    movie && (
                      <Link
                        to={`/details/${movie.id}`}
                        key={item._id}
                        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-64 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {movie.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {movie.runtime} мин
                        </p>
                      </Link>
                    )
                  );
                })
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Нет фильмов в списке.
                </p>
              )}
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center mb-4 space-x-2">
              <h2 className="text-2xl font-semibold">Посмотрел:</h2>
              <button
                onClick={toggleWatched}
                className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 transition duration-300 text-sm"
              >
                {isWatchedOpen ? "Скрыть" : "Показать"}
              </button>
            </div>
            <div
              className={`grid gap-6 sm:grid-cols-2 md:grid-cols-3 transition-all duration-500 overflow-hidden ${
                isWatchedOpen ? "max-h-full opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {watched.length > 0 ? (
                watched.map((item) => {
                  const movie = movies[item.movieId];
                  return (
                    movie && (
                      <Link
                        to={`/details/${movie.id}`}
                        key={item._id}
                        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-64 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {movie.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {movie.runtime} мин
                        </p>
                      </Link>
                    )
                  );
                })
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Нет просмотренных фильмов.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
