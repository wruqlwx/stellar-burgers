import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  useDispatch as dispatchHook,
  useSelector as selectorHook,
  TypedUseSelectorHook
} from 'react-redux';

import userReducer from './slices/userSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice'; // Убедись, что импорт верный

const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientsReducer,
  constructorSlice: constructorReducer,
  order: orderReducer,
  feeds: feedReducer // КЛЮЧ ДОЛЖЕН БЫТЬ 'feeds', чтобы feed.tsx его видел
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Используй ЭТИ хуки в компонентах, чтобы не было ошибки "state has any type"
export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
