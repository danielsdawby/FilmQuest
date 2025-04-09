import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getWatchList } from "../stores/slices/watchListSlice";
import { getMovieById } from "../stores/slices/movieSlice";
import axios from "axios";

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const watchlist = useSelector((state) => state.watchlist.watchlist);
  const movies = useSelector((state) => state.movie.movies);
  const dispatch = useDispatch();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    dispatch(getWatchList());
  }, [dispatch]);

  useEffect(() => {
    watchlist.forEach((item) => {
      if (!movies[item.movieId]) {
        dispatch(getMovieById(item.movieId));
      }
    });
  }, [watchlist, dispatch, movies]);


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`/api/note/${user._id}`);
        setNotes(response.data.notes || []);
      } catch (err) {
        console.error("Ошибка при получении заметок:", err);
      }
    };

    if (user) {
      fetchNotes();
    }
  }, [user]);

  const totalRuntime = watchlist.reduce((total, item) => {
    const movie = movies[item.movieId];
    return movie ? total + movie.runtime : total;
  }, 0);

  const wantToWatch = watchlist.filter((item) => item.type === "want");
  const watched = watchlist.filter((item) => item.type === "done");

  return (
    <div className="bg-dark">
      <div className="container min-h-[calc(100vh-64px-75px)] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-accent text-white shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Профиль пользователя</h1>

          <div className="space-y-4 mb-10">
            <p className="text-lg ">
              <span className="font-semibold">Никнейм:</span> {user?.email}
            </p>
            <p className="text-lg ">
              <span className="font-semibold">Кол-во просмотренных часов:</span> {totalRuntime} мин
            </p>
          </div>


          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Мои заметки</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {notes.length > 0 ? (
                notes.map((note) => {
                  const movie = movies[note.movieId];
                  return (
                    movie && (
                      <div key={note.movieId} className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <h3 className="text-xl font-bold text-gray-900">{movie.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{note.note}</p>
                      </div>
                    )
                  );
                })
              ) : (
                <p className="text-gray-600">Нет заметок.</p>
              )}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold  mb-4">Хочу посмотреть:</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {wantToWatch.length > 0 ? (
                wantToWatch.map((item) => {
                  const movie = movies[item.movieId];
                  return (
                    movie && (
                      <div
                        key={item._id}
                        className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                      >
                        <h3 className="text-xl font-bold text-gray-900">{movie.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{movie.runtime} мин</p>
                      </div>
                    )
                  );
                })
              ) : (
                <p className="text-gray-600">Нет фильмов в списке.</p>
              )}
            </div>
          </div>


          <div>
            <h2 className="text-2xl font-semibold mb-4">Посмотрел:</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {watched.length > 0 ? (
                watched.map((item) => {
                  const movie = movies[item.movieId];
                  return (
                    movie && (
                      <div
                        key={item._id}
                        className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                      >
                        <h3 className="text-xl font-bold text-gray-900">{movie.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{movie.runtime} мин</p>
                      </div>
                    )
                  );
                })
              ) : (
                <p className="text-gray-600">Нет просмотренных фильмов.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;