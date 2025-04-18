import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import movieReducer from "./slices/movieSlice";
import noteReducer from "./slices/noteSlice";
import watchlistReducer from "./slices/watchListSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    movie: movieReducer,
    notes: noteReducer,
    watchlist: watchlistReducer,

  },
});

export default store;
