import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axiosInstace.js";

export const addToWatchlist = createAsyncThunk("watchlist/addToWatchlist", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/movie/watched", data );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const getWatchList = createAsyncThunk("watchlist/getWatchList", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/movie/watched" );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const removeFromWatchlist = createAsyncThunk("watchlist/removeFromWatchlist", async (movieId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`/api/movie/${movieId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: {
    watchlist: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToWatchlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.watchlist.push(action.payload);
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
      .addCase(removeFromWatchlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.watchlist = state.watchlist.filter(item => item.movieId !== action.payload.movieId);
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getWatchList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWatchList.fulfilled, (state, action) => {
        state.loading = false;
        state.watchlist = action.payload.watchlist;
      })
      .addCase(getWatchList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default watchlistSlice.reducer;
