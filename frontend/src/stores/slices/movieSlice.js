import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axiosInstace.js";

export const getMovies = createAsyncThunk(
  "movies/getMovies",
  async ({ type, page = 1, genre, country, year }, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/movie", {
        params: { type, page, genre, country, year },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Server error");
    }
  }
);

export const getMovieRecommendations = createAsyncThunk(
  "movies/getRecommendations",
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/movie/recommendations/${movieId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchMovies = createAsyncThunk(
  "movies/searchMovies",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/movie/search`, {
        params: { query },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMovieById = createAsyncThunk(
  "movies/getMovieById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/movie/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFilterData = createAsyncThunk(
  "movies/getFilterData",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/movie/filters`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    movie: null,
    loading: false,
    error: null,
    searchResults: [],
    totalPages: 1,
    filters: {},
  },
  reducers: {
    clearSearch: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.results;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(getMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMovieById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMovieById.fulfilled, (state, action) => {
        state.loading = false;
        const movieData = action.payload;
        state.movies[movieData.id] = movieData;
        state.movie = action.payload;
      })
      .addCase(getMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.results;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getFilterData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFilterData.fulfilled, (state, action) => {
        state.loading = false;
        state.filters = action.payload;
      })
      .addCase(getFilterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearch } = movieSlice.actions;

export default movieSlice.reducer;
