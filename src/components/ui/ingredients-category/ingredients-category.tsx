import React, { forwardRef } from 'react';
import styles from './ingredients-category.module.css';
import { TIngredientsCategoryUIProps } from './type';
import { BurgerIngredientUI } from '../burger-ingredient';
import { useLocation } from 'react-router-dom';

export const IngredientsCategoryUI = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryUIProps
>(
  (
    { title, titleId, ingredients, ingredientsCounters, titleRef, handleAdd },
    ref
  ) => {
    const location = useLocation();

    return (
      <>
        {/* Только заголовок категории (например, "Булки") */}
        <h3
          className='text text_type_main-medium mt-10 mb-6'
          id={titleId}
          ref={titleRef}
        >
          {title}
        </h3>
        <ul className={styles.items} ref={ref}>
          {ingredients.map((ingredient) => (
            <BurgerIngredientUI
              ingredient={ingredient}
              key={ingredient._id}
              count={ingredientsCounters[ingredient._id]}
              locationState={{ background: location }}
              handleAdd={() => handleAdd(ingredient)}
            />
          ))}
        </ul>
      </>
    );
  }
);
