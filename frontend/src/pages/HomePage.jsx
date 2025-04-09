import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMovies } from "../stores/slices/movieSlice";
import TrendingMoviesSlider from "../components/TrendingMoviesSlider";
import ItemCart from "../components/ItemCart";
import Grid from '../assets/images/grid.svg';
import Row from '../assets/images/row.svg';

const HomePage = () => {
    const { movies, loading, error } = useSelector((state) => state.movie);
    const [selectedButton, setSelectedButton] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [gridLayout, setGridLayout] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        switch (selectedButton) {
            case 0:
                dispatch(getMovies({ type: "recommendations" }));
                break;
            case 1:
                dispatch(getMovies({ type: "movies" }));
                break;
            case 2:
                dispatch(getMovies({ type: "tv" })); 
                break;
            case 3:
                dispatch(getMovies({ type: "trending" }));
                break;
            default:
                dispatch(getMovies({ type: "movies" }));
        }
    }, [dispatch, selectedButton, selectedFilter]);

    const handleButtonSwitch = (number) => {
        setSelectedButton(number);
    };

    const toggleAccordion = () => {
        setIsAccordionOpen(!isAccordionOpen);
    };

    const handleGridLayoutChange = () => {
        setGridLayout(prev => !prev);
        console.log(gridLayout);
    };

    const handleSelectFilter = (number) => {
        setSelectedFilter(number);
    };

    const filteredMovies = () => {
        if (!movies || movies.length === 0) return [];
    
        return [...movies].filter(Boolean).sort((a, b) => { 
            switch (selectedFilter) {
                case 0:
                    return a?.title?.localeCompare(b?.title) || 0;
                case 1:
                    return (b?.vote_average || 0) - (a?.vote_average || 0);
                case 2:
                    return new Date(b?.release_date || 0) - new Date(a?.release_date || 0);
                case 3:
                    return (b?.popularity || 0) - (a?.popularity || 0);
                default:
                    return 0;
            }
        });
    };    

    return (
        <div className="bg-dark text-white">
            <div className="container">
                <TrendingMoviesSlider />
                <div className="flex justify-between gap-5 mt-10">
                    <div className="flex flex-col items-center text-2xl max-w-[200px] gap-4 w-full mt-20">
                        <button onClick={() => handleButtonSwitch(0)} className="btn">Рекомендации</button>
                        <button onClick={() => handleButtonSwitch(1)} className="btn">Фильмы</button>
                        <button onClick={() => handleButtonSwitch(2)} className="btn">Сериалы</button>
                        <button onClick={() => handleButtonSwitch(3)} className="btn">В тренде</button> 
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex relative justify-between items-center w-full py-2">
                            <div className="flex items-center">
                                <button onClick={toggleAccordion} className="font-bold text-xl">
                                    {isAccordionOpen ? "Скрыть" : "Сортировка"}
                                </button>
                            </div>
                        
                            {isAccordionOpen && (
                                <div className="mt-2 absolute top-10 left-0 bg-dark p-5 pr-10">
                                    <ul>
                                        <li className="cursor-pointer" onClick={() => handleSelectFilter(0)}>По имени</li>
                                        <li className="cursor-pointer" onClick={() => handleSelectFilter(1)}>По рейтингу</li>
                                        <li className="cursor-pointer" onClick={() => handleSelectFilter(2)}>По дате выхода</li>
                                        <li className="cursor-pointer" onClick={() => handleSelectFilter(3)}>По популярности</li>
                                    </ul>
                                </div>
                            )}
                        
                            <div className="flex items-center gap-5">
                                <button
                                    className="p-2 bg-accent rounded"
                                    disabled={!gridLayout}
                                    onClick={() => handleGridLayoutChange()}
                                >
                                    <img src={Row} alt="Row Layout" />
                                </button>
                                <button
                                    className="p-2 bg-accent rounded"
                                    disabled={gridLayout}
                                    onClick={() => handleGridLayoutChange()}
                                >
                                    <img src={Grid} alt="Grid Layout" />
                                </button>
                            </div>
                        </div>

                        <div className={`${gridLayout ? "grid grid-cols-6 gap-4" : "block"}`}>
                            {loading && <p>Loading movies...</p>}
                            {error && <p>Error: {error}</p>}

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
