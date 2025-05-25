import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMovies } from "../stores/slices/movieSlice";
import { getFilterData } from "../stores/slices/movieSlice";
import ItemCart from "../components/ItemCart";
import UpcomingPremieres from "../components/UpcomingPremieres";

import GridLight from "../assets/images/grid-light.svg";
import GridDark from "../assets/images/grid-dark.svg";
import RowLight from "../assets/images/row-light.svg";
import RowDark from "../assets/images/row-dark.svg";
import { motion } from "framer-motion";

function useDarkMode() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const classList = document.documentElement.classList;
    setIsDark(classList.contains("dark"));
    const obs = new MutationObserver(() => {
      setIsDark(classList.contains("dark"));
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }
    if (start > 1) pages.push(1, "...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) pages.push("...", totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={loading || currentPage === 1}
        className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition"
      >
        Назад
      </button>
      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-3 py-1 text-gray-500">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`px-3 py-1 rounded-lg transition ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            } ${loading ? "opacity-50 cursor-wait" : ""}`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={loading || currentPage === totalPages}
        className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition"
      >
        Вперёд
      </button>
    </div>
  );
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { movies, totalPages } = useSelector((state) => state.movie);
  const watchList = useSelector((state) => state.watchList?.movies || []);
  const filterData = useSelector((state) => state.movie?.filters || {});

  const [selectedButton, setSelectedButton] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [gridLayout, setGridLayout] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const [filterGenre, setFilterGenre] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const isDark = useDarkMode();
  const listTopRef = useRef(null);

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

    setLoadingData(true);
    setErrorMessage(null);

    dispatch(getFilterData());

    dispatch(
      getMovies({
        type,
        page: currentPage,
        genre: selectedGenre || undefined,
        country: selectedCountry || undefined,
        year: selectedYear || undefined,
      })
    )
      .unwrap()
      .catch(() =>
        setErrorMessage("Не удалось загрузить данные. Попробуйте снова.")
      )
      .finally(() => setLoadingData(false));
  }, [
    dispatch,
    selectedButton,
    currentPage,
    selectedGenre,
    selectedCountry,
    selectedYear,
  ]);

  useEffect(() => {
    if (!loadingData) {
      listTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [loadingData]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  const handleButtonSwitch = (num) => {
    setSelectedButton(num);
    setCurrentPage(1);
  };

  const handleRetry = () => {
    setErrorMessage(null);
    setCurrentPage(1);
    dispatch(getMovies({ type: "movies", page: currentPage }));
  };

  const getUniqueMovies = () => {
    const combined = [...movies, ...watchList].filter((m) => m?.id);
    return combined.filter(
      (m, i, self) => i === self.findIndex((x) => x.id === m.id)
    );
  };

  const filteredMovies = () => {
    const list = getUniqueMovies();
    if (!list.length) return [];
    return [...list].sort((a, b) => {
      switch (selectedFilter) {
        case 0:
          return (a.title ?? a.name ?? "").localeCompare(
            b.title ?? b.name ?? ""
          );
        case 1:
          return (b.vote_average || 0) - (a.vote_average || 0);
        case 2:
          return (
            new Date(b.release_date || b.first_air_date) -
            new Date(a.release_date || a.first_air_date)
          );
        case 3:
          return (b.popularity || 0) - (a.popularity || 0);
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
          <div className="flex flex-col items-start text-2xl max-w-[200px] gap-4 w-full mt-20">
            {["Рекомендации", "Фильмы", "Сериалы", "В тренде"].map((lbl, i) => (
              <button
                key={i}
                onClick={() => handleButtonSwitch(i)}
                className="btn dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200 w-full text-left"
              >
                {lbl}
              </button>
            ))}

            <div className="flex flex-col w-full mt-8 gap-3">
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Жанр</option>
                {filterData?.genres?.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Страна</option>
                {filterData?.countries?.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Год</option>
                {Array.from({ length: 30 }, (_, i) => {
                  const year = 2025 - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex mt-4 gap-2">
              <button
                className="w-1/2 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm"
                onClick={() => {
                  setFilterGenre("");
                  setFilterCountry("");
                  setFilterYear("");
                  setSelectedGenre("");
                  setSelectedCountry("");
                  setSelectedYear("");
                  setCurrentPage(1);
                }}
              >
                Сбросить фильтры
              </button>
              <button
                className="w-1/2 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition text-sm"
                onClick={() => {
                  setSelectedGenre(filterGenre);
                  setSelectedCountry(filterCountry);
                  setSelectedYear(filterYear);
                  setCurrentPage(1);
                }}
              >
                Применить фильтры
              </button>
            </div>
          </div>

          <div className="flex flex-col items-start flex-grow">
            <div className="flex relative justify-between items-center w-full py-2">
              <button
                onClick={() => setIsAccordionOpen((o) => !o)}
                className="font-bold text-xl text-gray-900 dark:text-white"
              >
                {isAccordionOpen ? "Скрыть" : "Сортировка"}
              </button>

              {isAccordionOpen && (
                <div className="mt-2 absolute top-10 left-0 bg-white dark:bg-dark p-5 shadow-lg rounded-lg z-10 border border-gray-200 dark:border-gray-800">
                  <ul className="text-gray-900 dark:text-white space-y-2">
                    {[
                      "По имени",
                      "По рейтингу",
                      "По дате выхода",
                      "По популярности",
                    ].map((lbl, idx) => (
                      <li
                        key={idx}
                        className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                        onClick={() => setSelectedFilter(idx)}
                      >
                        {lbl}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-5">
                <button
                  onClick={() => setGridLayout((g) => !g)}
                  disabled={gridLayout}
                  className={`p-2 rounded transition-colors duration-200 ${
                    !gridLayout
                      ? "bg-gray-200 dark:bg-accent"
                      : "bg-transparent"
                  }`}
                  aria-label="Row Layout"
                >
                  <img
                    src={isDark ? RowDark : RowLight}
                    alt="Row"
                    className="w-6 h-6"
                  />
                </button>
                <button
                  onClick={() => setGridLayout((g) => !g)}
                  disabled={!gridLayout}
                  className={`p-2 rounded transition-colors duration-200 ${
                    gridLayout ? "bg-gray-200 dark:bg-accent" : "bg-transparent"
                  }`}
                  aria-label="Grid Layout"
                >
                  <img
                    src={isDark ? GridDark : GridLight}
                    alt="Grid"
                    className="w-6 h-6"
                  />
                </button>
              </div>
            </div>

            <div ref={listTopRef} />

            <motion.div
              className={
                gridLayout
                  ? "grid grid-cols-6 gap-4 w-full"
                  : "flex flex-col gap-4 max-w-3xl"
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {loadingData
                ? Array(12)
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={idx}
                        className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"
                      />
                    ))
                : filteredMovies().map((movie) => (
                    <ItemCart key={movie.id} movie={movie} />
                  ))}
            </motion.div>

            {errorMessage && (
              <motion.p
                className="text-red-500 text-center my-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {errorMessage}
                <button
                  onClick={handleRetry}
                  className="ml-4 text-blue-500 hover:underline"
                >
                  Попробовать снова
                </button>
              </motion.p>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={loadingData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
