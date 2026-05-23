import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerAPI, loginAPI } from "../api/authAPI";

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      return await registerAPI(formData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      return await loginAPI(formData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    token: localStorage.getItem("token") || null,

    user: JSON.parse(
      localStorage.getItem("user")
    ) || null,

    isAuthenticate:
      !!localStorage.getItem("token"),

    loading: false,

    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {

        state.loading = false;

        const token = action.payload.token;

        const user = action.payload.user;

        state.token = token;

        state.user = user;

        state.isAuthenticate = true;

        localStorage.setItem(
          "token",
          token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      })

      .addCase(loginUser.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;








