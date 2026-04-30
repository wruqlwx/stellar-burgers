import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { clearConstructor } from './constructorSlice';

export const getOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/getByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);

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
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Failed to get order';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
