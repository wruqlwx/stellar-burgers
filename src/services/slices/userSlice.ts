import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser, TOrder } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  fetchWithRefresh
} from '../../utils/burger-api';

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: any) => {
    const res = await registerUserApi(data);
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk('user/login', async (data: any) => {
  const res = await loginUserApi(data);
  localStorage.setItem('accessToken', res.accessToken);
  localStorage.setItem('refreshToken', res.refreshToken);
  return res.user;
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUser = createAsyncThunk('user/update', async (data: any) => {
  const res = await updateUserApi(data);
  return res.user;
});

export const checkUserAuth = createAsyncThunk('user/checkAuth', async () => {
  if (localStorage.getItem('accessToken')) {
    try {
      const res = await getUserApi();
      return res.user;
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
  return null;
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

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null as TUser | null,
    orders: [] as TOrder[],
    isLoading: false,
    isAuthChecked: false,
    error: null as string | null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
