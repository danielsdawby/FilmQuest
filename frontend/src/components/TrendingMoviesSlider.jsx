import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/swiper-bundle.css"; 

const TrendingMoviesSlider = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrendingMovies = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/movie/trending");
                setMovies(response.data.results); 
                setLoading(false);
            } catch (error) {
                console.error("Ошибка загрузки трендовых фильмов:", error.message);
                setError("Ошибка загрузки трендовых фильмов");
                setLoading(false);
            }
        };

        fetchTrendingMovies();
    }, []);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="">
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={50}
                slidesPerView={3}
                navigation
                loop={true}
                autoplay={{ delay: 5000 }}
                pagination={{ clickable: true }}
            >
                {movies.map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <div className="movie-slide">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="movie-poster"
                            />
                            {/* <h3>{movie.title}</h3> */}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default TrendingMoviesSlider;