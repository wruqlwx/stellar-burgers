import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser, TOrder } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  logoutApi,
  fetchWithRefresh
} from '../../utils/burger-api';

export const loginUser = createAsyncThunk('user/login', loginUserApi);
export const checkUserAuth = createAsyncThunk('user/checkAuth', getUserApi);
export const updateUser = createAsyncThunk('user/update', updateUserApi);
export const registerUser = createAsyncThunk('user/register', registerUserApi);
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
});

export const fetchUserOrders = createAsyncThunk('user/getOrders', async () => {
  const res = await fetchWithRefresh<{ success: boolean; orders: TOrder[] }>(
    '/orders',
    {
      method: 'GET',
      headers: { Authorization: localStorage.getItem('accessToken') || '' }
    }
  );
  return res.orders;
});

interface UserState {
  user: TUser | null;
  orders: TOrder[];
  isAuthChecked: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  orders: [],
  isAuthChecked: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка входа';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.orders = [];
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
