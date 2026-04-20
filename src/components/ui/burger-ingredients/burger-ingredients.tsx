import React, { FC, memo } from 'react';
import { Tab } from '@zlden/react-developer-burger-ui-components';
import styles from './burger-ingredients.module.css';
import { BurgerIngredientsUIProps } from './type';
import { IngredientsCategory } from '../../ingredients-category';

export const BurgerIngredientsUI: FC<BurgerIngredientsUIProps> = memo(
  ({
    currentTab,
    buns,
    mains,
    sauces,
    titleBunRef,
    titleMainRef,
    titleSaucesRef,
    bunsRef,
    mainsRef,
    saucesRef,
    onTabClick
  }) => (
    <section className={styles.burger_ingredients}>
      {/* Контейнер табов с горизонтальным расположением */}
      <div className={styles.tabs}>
        <Tab value='bun' active={currentTab === 'bun'} onClick={onTabClick}>
          Булки
        </Tab>
        <Tab value='sauce' active={currentTab === 'sauce'} onClick={onTabClick}>
          Соусы
        </Tab>
        <Tab value='main' active={currentTab === 'main'} onClick={onTabClick}>
          Начинки
        </Tab>
      </div>

      {/* Контейнер с категориями ингредиентов */}
      <div className={styles.content}>
        <div ref={bunsRef}>
          <IngredientsCategory
            title='Булки'
            titleId='bun'
            ingredients={buns}
            ref={titleBunRef}
          />
        </div>
        <div ref={saucesRef}>
          <IngredientsCategory
            title='Соусы'
            titleId='sauce'
            ingredients={sauces}
            ref={titleSaucesRef}
          />
        </div>
        <div ref={mainsRef}>
          <IngredientsCategory
            title='Начинки'
            titleId='main'
            ingredients={mains}
            ref={titleMainRef}
          />
        </div>
      </div>
    </section>
  )
);
