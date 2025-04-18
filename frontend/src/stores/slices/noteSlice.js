import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axiosInstace.js";

export const addMovieNote = createAsyncThunk(
  "notes/addMovieNote",
  async ({ userId, movieId, note }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/note", { userId, movieId, note });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getMovieNotes = createAsyncThunk(
  "notes/getMovieNotes",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/note/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteMovieNote = createAsyncThunk(
  "notes/deleteMovieNote",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/note/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const noteSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addMovieNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMovieNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.push(action.payload);
      })
      .addCase(addMovieNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getMovieNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMovieNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(getMovieNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteMovieNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMovieNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter((note) => note._id !== action.payload);
      })
      .addCase(deleteMovieNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default noteSlice.reducer;
