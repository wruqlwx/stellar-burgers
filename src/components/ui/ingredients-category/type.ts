import { TIngredient } from '@utils-types';
import React from 'react';

export type TIngredientsCategoryUIProps = {
  title: string;
  titleId: string;
  ingredients: TIngredient[];
  ingredientsCounters: Record<string, number>;
  titleRef: React.Ref<HTMLHeadingElement>;
  handleAdd: (ingredient: TIngredient) => void;
};
