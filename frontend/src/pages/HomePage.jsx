import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMovies } from "../stores/slices/movieSlice";
import ItemCart from "../components/ItemCart";
import UpcomingPremieres from "../components/UpcomingPremieres";

import GridLight from "../assets/images/grid-light.svg";
import GridDark from "../assets/images/grid-dark.svg";
import RowLight from "../assets/images/row-light.svg";
import RowDark from "../assets/images/row-dark.svg";

function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const classList = document.documentElement.classList;
    setIsDark(classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

const HomePage = () => {
  const dispatch = useDispatch();

  // Основные фильмы для главной страницы
  const { movies, loading, error } = useSelector((state) => state.movie);

  // Фильмы из списка "хочу посмотреть" пользователя с защитой от undefined
  const watchList = useSelector((state) => state.watchList?.movies || []);

  const [selectedButton, setSelectedButton] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [gridLayout, setGridLayout] = useState(true);

  const isDark = useDarkMode();

  useEffect(() => {
    let type;
    switch (selectedButton) {
      case 0:
        type = "recommendations";
        break;
      case 1:
        type = "movies";
        break;
      case 2:
        type = "tv";
        break;
      case 3:
        type = "trending";
        break;
      default:
        type = "movies";
    }
    dispatch(getMovies({ type }));
  }, [dispatch, selectedButton]);

  const handleButtonSwitch = (number) => {
    setSelectedButton(number);
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handleGridLayoutChange = () => {
    setGridLayout((prev) => !prev);
  };

  const handleSelectFilter = (number) => {
    setSelectedFilter(number);
  };

  const getUniqueMovies = () => {
    const combined = [...(movies || []), ...(watchList || [])].filter(
      (movie) => movie && typeof movie.id !== "undefined"
    );

    return combined.filter(
      (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
    );
  };

  const filteredMovies = () => {
    const uniqueMovies = getUniqueMovies();

    if (!uniqueMovies || uniqueMovies.length === 0) return [];

    return [...uniqueMovies].sort((a, b) => {
      switch (selectedFilter) {
        case 0:
          return a?.title?.localeCompare(b?.title) || 0;
        case 1:
          return (b?.vote_average || 0) - (a?.vote_average || 0);
        case 2:
          return (
            new Date(b?.release_date || 0) - new Date(a?.release_date || 0)
          );
        case 3:
          return (b?.popularity || 0) - (a?.popularity || 0);
        default:
          return 0;
      }
    });
  };

  return (
    <div className="bg-white dark:bg-dark text-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
      <div className="container mx-auto px-4">
        <UpcomingPremieres />
        <div className="flex justify-between gap-5 mt-10">
          <div className="flex flex-col items-center text-2xl max-w-[200px] gap-4 w-full mt-20">
            <button
              onClick={() => handleButtonSwitch(0)}
              className="btn dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
            >
              Рекомендации
            </button>
            <button
              onClick={() => handleButtonSwitch(1)}
              className="btn dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
            >
              Фильмы
            </button>
            <button
              onClick={() => handleButtonSwitch(2)}
              className="btn dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
            >
              Сериалы
            </button>
            <button
              onClick={() => handleButtonSwitch(3)}
              className="btn dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
            >
              В тренде
            </button>
          </div>

          <div className="flex flex-col items-start flex-grow">
            <div className="flex relative justify-between items-center w-full py-2">
              <div className="flex items-center">
                <button
                  onClick={toggleAccordion}
                  className="font-bold text-xl text-gray-900 dark:text-white"
                >
                  {isAccordionOpen ? "Скрыть" : "Сортировка"}
                </button>
              </div>

              {isAccordionOpen && (
                <div className="mt-2 absolute top-10 left-0 bg-white dark:bg-dark p-5 pr-10 shadow-lg rounded-lg z-10 border border-gray-200 dark:border-gray-800">
                  <ul className="text-gray-900 dark:text-white">
                    <li
                      className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => handleSelectFilter(0)}
                    >
                      По имени
                    </li>
                    <li
                      className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => handleSelectFilter(1)}
                    >
                      По рейтингу
                    </li>
                    <li
                      className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => handleSelectFilter(2)}
                    >
                      По дате выхода
                    </li>
                    <li
                      className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => handleSelectFilter(3)}
                    >
                      По популярности
                    </li>
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-5">
                <button
                  className={`p-2 rounded transition-colors duration-200 ${
                    !gridLayout
                      ? "bg-gray-200 dark:bg-accent"
                      : "bg-transparent dark:bg-transparent"
                  }`}
                  disabled={gridLayout}
                  onClick={handleGridLayoutChange}
                  aria-label="Row Layout"
                >
                  <img
                    src={isDark ? RowDark : RowLight}
                    alt="Row Layout"
                    className="w-6 h-6"
                  />
                </button>

                <button
                  className={`p-2 rounded transition-colors duration-200 ${
                    gridLayout
                      ? "bg-gray-200 dark:bg-accent"
                      : "bg-transparent dark:bg-transparent"
                  }`}
                  disabled={!gridLayout}
                  onClick={handleGridLayoutChange}
                  aria-label="Grid Layout"
                >
                  <img
                    src={isDark ? GridDark : GridLight}
                    alt="Grid Layout"
                    className="w-6 h-6"
                  />
                </button>
              </div>
            </div>

            <div
              className={
                gridLayout
                  ? "grid grid-cols-6 gap-4 w-full"
                  : "flex flex-col gap-4 max-w-3xl"
              }
            >
              {loading && <p>Loading movies...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}

              {filteredMovies().map((item) => (
                <ItemCart key={item.id} movie={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
