import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '../../utils/burger-api';

interface TFeedsResponse {
  orders: TOrder[];
  total: number;
  totalToday: number;
}

export const fetchFeeds = createAsyncThunk<TFeedsResponse>(
  'feeds/getAll',
  async () => {
    const response = await getFeedsApi();
    return response as TFeedsResponse;
  }
);

export const feedSlice = createSlice({
  name: 'feeds',
  initialState: {
    orders: [] as TOrder[],
    total: 0,
    totalToday: 0,
    isLoading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default feedSlice.reducer;
