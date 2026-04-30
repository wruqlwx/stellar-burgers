import { TOrder } from '@utils-types';
import orderReducer, { clearOrder } from '../services/slices/orderSlice';
import { orderBurger, getOrderByNumber } from '../services/slices/orderSlice';
import { Action } from '@reduxjs/toolkit';

describe('orderSlice', () => {
  const initialState = {
    orderRequest: false,
    orderModalData: null as TOrder | null,
    error: null as string | null
  };

  const mockOrder: TOrder = {
    _id: 'order_id',
    number: 12345,
    name: 'Тестовый заказ',
    status: 'done',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ingredients: []
  };

  describe('clearOrder', () => {
    it('должен очистить данные заказа', () => {
      const stateWithOrder = {
        ...initialState,
        orderModalData: mockOrder
      };

      const state = orderReducer(stateWithOrder, clearOrder());

      expect(state.orderModalData).toBeNull();
    });
  });

  describe('orderBurger async thunk', () => {
    it('должен установить orderRequest в true при начале запроса', () => {
      const action = {
        type: orderBurger.pending.type
      };
      const state = orderReducer(initialState, action as Action);

      expect(state.orderRequest).toBe(true);
    });

    it('должен установить orderRequest в false и сохранить данные при успехе', () => {
      const stateWithPending = { ...initialState, orderRequest: true };

      const action = {
        type: orderBurger.fulfilled.type,
        payload: { order: mockOrder }
      };
      const state = orderReducer(stateWithPending, action as Action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('должен установить orderRequest в false и записать ошибку при неудаче', () => {
      const stateWithPending = { ...initialState, orderRequest: true };

      const action = {
        type: orderBurger.rejected.type,
        error: { message: 'Ошибка при создании заказа' }
      };
      const state = orderReducer(stateWithPending, action as Action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Ошибка при создании заказа');
    });
  });

  describe('getOrderByNumber async thunk', () => {
    it('должен установить orderRequest в true при начале запроса', () => {
      const action = {
        type: getOrderByNumber.pending.type
      };
      const state = orderReducer(initialState, action as Action);

      expect(state.orderRequest).toBe(true);
    });

    it('должен установить orderRequest в false и сохранить данные при успехе', () => {
      const stateWithPending = { ...initialState, orderRequest: true };

      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(stateWithPending, action as Action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('должен установить orderRequest в false и записать ошибку при неудаче', () => {
      const stateWithPending = { ...initialState, orderRequest: true };

      const action = {
        type: getOrderByNumber.rejected.type,
        error: { message: 'Ошибка при получении заказа' }
      };
      const state = orderReducer(stateWithPending, action as Action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Ошибка при получении заказа');
    });
  });
});
