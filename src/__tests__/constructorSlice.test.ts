import { TConstructorIngredient, TIngredient } from '@utils-types';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../services/slices/constructorSlice';

describe('constructorSlice', () => {
  const initialState = {
    bun: null as TIngredient | null,
    ingredients: [] as TConstructorIngredient[]
  };

  const mockBun: TIngredient = {
    _id: 'bun_id',
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
  };

  const mockIngredient: TIngredient = {
    _id: 'ing_id',
    name: 'Тестовый ингредиент',
    type: 'main',
    price: 50,
    proteins: 5,
    fat: 10,
    carbohydrates: 15,
    calories: 100,
    image: 'test.png',
    image_mobile: 'test.png',
    image_large: 'test.png'
  };

  describe('addIngredient', () => {
    it('должен добавить булку в конструктор', () => {
      const state = constructorReducer(initialState, addIngredient(mockBun));

      expect(state.bun).toBeTruthy();
      expect(state.bun?.name).toBe('Тестовая булка');
    });

    it('должен добавить обычный ингредиент в конструктор', () => {
      const state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe('Тестовый ингредиент');
    });

    it('должен присвоить уникальный id добавленному ингредиенту', () => {
      const state1 = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      const state2 = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );

      expect(state1.ingredients[0].id).not.toBe(state2.ingredients[0].id);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент из конструктора', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      const ingredientId = state.ingredients[0].id;

      state = constructorReducer(state, removeIngredient(ingredientId));

      expect(state.ingredients).toHaveLength(0);
    });

    it('должен удалить только указанный ингредиент', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'another_id' })
      );

      const ingredientId = state.ingredients[0].id;
      state = constructorReducer(state, removeIngredient(ingredientId));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe('another_id');
    });
  });

  describe('moveIngredient', () => {
    it('должен переместить ингредиент на новую позицию', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'ing2' })
      );
      state = constructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'ing3' })
      );

      state = constructorReducer(state, moveIngredient({ from: 0, to: 2 }));

      expect(state.ingredients[0]._id).toBe('ing2');
      expect(state.ingredients[2]._id).toBe(mockIngredient._id);
    });
  });

  describe('clearConstructor', () => {
    it('должен очистить конструктор', () => {
      let state = constructorReducer(initialState, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(mockIngredient));

      state = constructorReducer(state, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
