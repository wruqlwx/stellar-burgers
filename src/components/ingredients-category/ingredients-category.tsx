import { forwardRef, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { addIngredient } from '../../services/slices/constructorSlice';
import React from 'react';

interface TIngredientsCategoryProps {
  title: string;
  titleId: string;
  ingredients: TIngredient[];
}

export const IngredientsCategory = forwardRef<
  HTMLHeadingElement,
  TIngredientsCategoryProps
>(({ title, titleId, ingredients }, ref) => {
  const dispatch = useDispatch();
  const { bun, ingredients: constructorIngredients } = useSelector(
    (state) => state.constructorSlice
  );

  const ingredientsCounters = useMemo(() => {
    const counts: { [key: string]: number } = {};
    constructorIngredients.forEach((item: TIngredient) => {
      counts[item._id] = (counts[item._id] || 0) + 1;
    });
    if (bun) counts[bun._id] = 2;
    return counts;
  }, [bun, constructorIngredients]);

  const handleAdd = (ingredient: TIngredient) => {
    dispatch(addIngredient(ingredient));
  };

  return (
    <IngredientsCategoryUI
      title={title}
      titleId={titleId}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      titleRef={ref}
      handleAdd={handleAdd}
    />
  );
});
