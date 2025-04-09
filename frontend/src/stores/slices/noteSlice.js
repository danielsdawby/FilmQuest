import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axiosInstace.js";

export const addMovieNote = createAsyncThunk("notes/addMovieNote", async (noteData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/note", noteData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const getMovieNotes = createAsyncThunk("notes/getMovieNotes", async (movieId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/note`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const getOneMovieNote = createAsyncThunk("notes/getOneMovieNote", async (movieId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/note/${movieId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const noteSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
    note: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addMovieNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMovieNote.fulfilled, (state, action) => {
        state.loading = false;
        state.note = action.payload.note;
      })
      .addCase(addMovieNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getOneMovieNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOneMovieNote.fulfilled, (state, action) => {
        state.loading = false;
        state.note = action.payload.note;
      })
      .addCase(getOneMovieNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMovieNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMovieNotes.fulfilled, (state, action) => {
        state.loading = false;
        console.log(getMovieNotes);
        state.notes = action.payload.note;
      })
      .addCase(getMovieNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default noteSlice.reducer;
