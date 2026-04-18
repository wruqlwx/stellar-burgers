import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  useDispatch as dispatchHook,
  useSelector as selectorHook,
  TypedUseSelectorHook
} from 'react-redux';

import ingredientsReducer, {
  ingredientsSlice
} from './slices/ingredientsSlice';
import orderReducer, { orderSlice } from './slices/orderSlice';
import userReducer, { userSlice } from './slices/userSlice';
import constructorReducer, {
  constructorSlice
} from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';

const rootReducer = combineReducers({
  [ingredientsSlice.name]: ingredientsReducer,
  [orderSlice.name]: orderReducer,
  [userSlice.name]: userReducer,
  [constructorSlice.name]: constructorReducer,
  feeds: feedReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
