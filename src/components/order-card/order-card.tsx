import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { TOrder, TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { OrderCardUI } from '../ui/order-card';

export const OrderCard: FC<{ order: TOrder }> = memo(({ order }) => {
  const location = useLocation();
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const orderIngredients = order.ingredients
      .map((id) => ingredients.find((ing) => ing._id === id))
      .filter((ing): ing is TIngredient => !!ing);

    const total = orderIngredients.reduce((acc, ing) => acc + ing.price, 0);

    const ingredientsInfo = orderIngredients.reduce(
      (acc: TIngredient[], item) => {
        if (!acc.find((ing) => ing._id === item._id)) acc.push(item);
        return acc;
      },
      []
    );

    const maxIngredients = 6;
    const ingredientsToShow = orderIngredients.slice(0, maxIngredients);
    const remains = Math.max(0, orderIngredients.length - maxIngredients);

    return {
      ...order,
      ingredientsToShow,
      ingredientsInfo,
      remains,
      total,
      date: new Date(order.createdAt)
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={6}
      locationState={{ background: location }}
    />
  );
});
