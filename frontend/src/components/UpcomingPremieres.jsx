import React, { useEffect, useState } from 'react';
 import axios from 'axios';
 import { Swiper, SwiperSlide } from 'swiper/react';
 import { Navigation, Pagination, Autoplay } from 'swiper/modules';
 import { useNavigate } from 'react-router-dom';
 import 'swiper/swiper-bundle.css';
 import ThemeToggle from './ThemeToggle';
 
 const UpcomingPremieres = () => {
   const [movies, setMovies] = useState([]);
   const [trailer, setTrailer] = useState(null); 
   const [isModalOpen, setIsModalOpen] = useState(false); 
   const navigate = useNavigate(); 
 
   useEffect(() => {
     axios.get('http://localhost:5000/api/movie/upcoming')
       .then(res => setMovies(res.data.results))
       .catch(err => console.error('Ошибка загрузки премьер:', err));
   }, []);
 
   const handleTrailerClick = (movie) => {
     setTrailer(movie.trailer);
     setIsModalOpen(true); 
   };
 
   const closeModal = () => {
     setIsModalOpen(false); 
     setTrailer(null);
   };
 
   const handlePosterClick = (movieId) => {
     navigate(`/details/${movieId}`); 
   };
 
   return (
     <div className="p-4">
       <Swiper
         modules={[Navigation, Pagination, Autoplay]}
         spaceBetween={20}
         slidesPerView={3}
         navigation
         autoplay={{ delay: 3000 }}
         pagination={{ clickable: true }}
         loop={true}
       >
         {movies.map((movie) => (
           <SwiperSlide key={movie.id}>
             <div className="min-w-[350px] max-w-[450px] rounded-xl bg-gray-900 text-white shadow-lg overflow-hidden">
               <div className="relative">
                 <img
                   src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
                   alt={movie.title}
                   className="w-full h-80 object-cover cursor-pointer"
                   onClick={() => handlePosterClick(movie.id)} 
                 />
                 <button
                   onClick={() => handleTrailerClick(movie)}
                   className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700"
                 >
                   Смотреть трейлер
                 </button>
               </div>
               <div className="p-2">
                 <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
                 <p className="text-sm text-gray-400 line-clamp-2">{movie.overview}</p>
               </div>
             </div>
           </SwiperSlide>
         ))}
       </Swiper>
 
       {}
       {isModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
           <div className="bg-white p-4 rounded-lg max-w-6xl w-full h-[80%] relative">
             {}
             <button
               onClick={closeModal}
               className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 font-bold text-3xl p-2 rounded-full shadow-xl"
             >
               &times;
             </button>
             <iframe
               className="w-full h-full"
               src={trailer}
               title="Trailer"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
             ></iframe>
           </div>
         </div>
       )}
     </div>
   );
 };
 
 export default UpcomingPremieres;