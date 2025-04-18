import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../axiosInstace.js";

const genderMap = {
  0: "Неизвестно",
  1: "Женский",
  2: "Мужской",
};

const ActorPage = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/person/${id}`);
        setActor(response.data);
      } catch (err) {
        setError("Ошибка при загрузке данных актёра");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActor();
  }, [id]);

  if (loading)
    return (
      <div className="text-center text-xl text-gray-900 dark:text-white py-10 bg-white dark:bg-dark transition-colors duration-300 min-h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 text-lg py-10 bg-white dark:bg-dark transition-colors duration-300 min-h-screen flex items-center justify-center">
        Ошибка: {error}
      </div>
    );
  if (!actor)
    return (
      <div className="text-center text-gray-400 py-10 bg-white dark:bg-dark transition-colors duration-300 min-h-screen flex items-center justify-center">
        Актёр не найден
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-dark text-gray-900 dark:text-white py-10 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-10 transition-colors duration-300">
        {/* Левая колонка: фото */}
        <div className="md:w-1/3 relative">
          <img
            src={
              actor.profile_path
                ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                : "https://via.placeholder.com/400x600?text=No+Image"
            }
            alt={actor.name}
            className="rounded-xl shadow-lg w-full object-cover"
          />
        </div>

        {/* Правая колонка: информация */}
        <div className="md:w-2/3 space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{actor.name}</h1>

          {/* Основные данные */}
          <div className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed space-y-1">
            {actor.also_known_as && actor.also_known_as.length > 0 && (
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Также известен как: </span>
                {actor.also_known_as.join(", ")}
              </p>
            )}
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Дата рождения: </span>
              {actor.birthday || "Неизвестно"}
            </p>
            {actor.deathday && (
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Дата смерти: </span>
                {actor.deathday}
              </p>
            )}
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Место рождения: </span>
              {actor.place_of_birth || "Неизвестно"}
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Пол: </span>
              {genderMap[actor.gender] || "Неизвестно"}
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Известность: </span>
              {actor.popularity ? actor.popularity.toFixed(1) : "Неизвестно"}
            </p>
          </div>

          {/* Социальные сети */}
          {actor.external_ids && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Социальные сети</h2>
              <div className="flex space-x-4 text-gray-700 dark:text-gray-300">
                {actor.external_ids.facebook_id && (
                  <a
                    href={`https://facebook.com/${actor.external_ids.facebook_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                    aria-label="Facebook"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99h-2.2v-2.88h2.2v-2.2c0-2.17 1.3-3.37 3.3-3.37.96 0 1.97.17 1.97.17v2.17h-1.1c-1.08 0-1.42.67-1.42 1.36v1.87h2.42l-.39 2.88h-2.03v6.99A10 10 0 0 0 22 12" />
                    </svg>
                  </a>
                )}
                {actor.external_ids.twitter_id && (
                  <a
                    href={`https://twitter.com/${actor.external_ids.twitter_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400"
                    aria-label="Twitter"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14.86A4.48 4.48 0 0 0 22.4.4a9.06 9.06 0 0 1-2.88 1.1 4.52 4.52 0 0 0-7.7 4.12A12.9 12.9 0 0 1 1.64 2.16 4.52 4.52 0 0 0 3 9.72a4.48 4.48 0 0 1-2.05-.57v.06a4.53 4.53 0 0 0 3.63 4.43 4.5 4.5 0 0 1-2.04.08 4.53 4.53 0 0 0 4.22 3.15A9.06 9.06 0 0 1 1 19.54a12.8 12.8 0 0 0 6.92 2.03c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.42-.02-.63A9.18 9.18 0 0 0 23 3z" />
                    </svg>
                  </a>
                )}
                {actor.external_ids.instagram_id && (
                  <a
                    href={`https://instagram.com/${actor.external_ids.instagram_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-600"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm5 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.5-.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Биография */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Биография</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
              {actor.biography || "Биография отсутствует"}
            </p>
          </div>

          {/* Фильмография */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Фильмография</h2>

            {/* Фильмы */}
            {actor.movie_credits?.cast?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Фильмы</h3>
                <div className="flex flex-wrap gap-6">
                  {actor.movie_credits.cast.slice(0, 12).map((movie) => (
                    <Link
                      key={movie.id}
                      to={`/details/${movie.id}`}
                      className="w-32 hover:scale-105 transform transition-transform duration-200"
                      title={movie.title}
                    >
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : "https://via.placeholder.com/300x450?text=No+Poster"
                        }
                        alt={movie.title}
                        className="rounded-lg shadow-md object-cover w-full h-48"
                      />
                      <p className="mt-2 text-center text-sm font-medium truncate">{movie.title}</p>
                      <p className="text-center text-xs text-gray-500 dark:text-gray-400 truncate">
                        {movie.character ? `Роль: ${movie.character}` : ""}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ТВ-шоу */}
            {actor.tv_credits?.cast?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">ТВ-шоу</h3>
                <div className="flex flex-wrap gap-6">
                  {actor.tv_credits.cast.slice(0, 12).map((tv) => (
                    <Link
                      key={tv.id}
                      to={`/details/${tv.id}`}
                      className="w-32 hover:scale-105 transform transition-transform duration-200"
                      title={tv.name}
                    >
                      <img
                        src={
                          tv.poster_path
                            ? `https://image.tmdb.org/t/p/w300${tv.poster_path}`
                            : "https://via.placeholder.com/300x450?text=No+Poster"
                        }
                        alt={tv.name}
                        className="rounded-lg shadow-md object-cover w-full h-48"
                      />
                      <p className="mt-2 text-center text-sm font-medium truncate">{tv.name}</p>
                      <p className="text-center text-xs text-gray-500 dark:text-gray-400 truncate">
                        {tv.character ? `Роль: ${tv.character}` : ""}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorPage;
