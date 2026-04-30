import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../services/slices/userSlice';
import ingredientsReducer from '../services/slices/ingredientsSlice';
import constructorReducer from '../services/slices/constructorSlice';
import orderReducer from '../services/slices/orderSlice';
import feedReducer from '../services/slices/feedSlice';

const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientsReducer,
  constructorSlice: constructorReducer,
  order: orderReducer,
  feeds: feedReducer
});

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние при вызове с undefined', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toBeDefined();
    expect(state.user).toBeDefined();
    expect(state.ingredients).toBeDefined();
    expect(state.constructorSlice).toBeDefined();
    expect(state.order).toBeDefined();
    expect(state.feeds).toBeDefined();
  });

  it('должен иметь правильную структуру состояния', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state.user).toMatchObject({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null,
      orders: []
    });

    expect(state.ingredients).toMatchObject({
      ingredients: [],
      loading: false,
      error: null
    });

    expect(state.constructorSlice).toMatchObject({
      bun: null,
      ingredients: []
    });

    expect(state.order).toMatchObject({
      orderRequest: false,
      orderModalData: null,
      error: null
    });
  });
});
