import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { clearConstructor } from './constructorSlice';

export const orderBurger = createAsyncThunk(
  'order/post',
  async (data: string[], { dispatch }) => {
    const response = await orderBurgerApi(data);
    dispatch(clearConstructor());
    return response;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orderRequest: false,
    orderModalData: null as TOrder | null,
    error: null as string | null
  },
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Order failed';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
