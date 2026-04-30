import { TIngredient } from '@utils-types';
import ingredientsReducer, {
  fetchIngredients
} from '../services/slices/ingredientsSlice';
import { Action } from '@reduxjs/toolkit';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [] as TIngredient[],
    loading: false,
    error: null as string | null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: 'ing1',
      name: 'Тестовая булка',
      type: 'bun',
      price: 100,
      proteins: 10,
      fat: 20,
      carbohydrates: 30,
      calories: 250,
      image: 'test.png',
      image_mobile: 'test.png',
      image_large: 'test.png'
    },
    {
      _id: 'ing2',
      name: 'Тестовая начинка',
      type: 'main',
      price: 50,
      proteins: 5,
      fat: 10,
      carbohydrates: 15,
      calories: 100,
      image: 'test.png',
      image_mobile: 'test.png',
      image_large: 'test.png'
    }
  ];

  describe('fetchIngredients async thunk', () => {
    it('должен установить loading в true при начале запроса', () => {
      const action = {
        type: fetchIngredients.pending.type
      };
      const state = ingredientsReducer(initialState, action as Action);

      expect(state.loading).toBe(true);
    });

    it('должен установить loading в false и сохранить ингредиенты при успехе', () => {
      const stateWithLoading = { ...initialState, loading: true };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(stateWithLoading, action as Action);

      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('должен установить loading в false и записать ошибку при неудаче', () => {
      const stateWithLoading = { ...initialState, loading: true };

      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка при получении ингредиентов' }
      };
      const state = ingredientsReducer(stateWithLoading, action as Action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка при получении ингредиентов');
    });
  });
});
