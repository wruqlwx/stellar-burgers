import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { TIngredient, TOrder } from '@utils-types';
import { getOrderByNumber } from '../../services/slices/orderSlice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const { orderModalData, orderRequest } = useSelector((state) => state.order);
  const { ingredients } = useSelector((state) => state.ingredients);

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumber(parseInt(number)));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderModalData || !ingredients.length) return null;

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderModalData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        const ingredient = ingredients.find(
          (ing: TIngredient) => ing._id === item
        );
        if (ingredient) {
          if (!acc[item]) {
            acc[item] = { ...ingredient, count: 1 };
          } else {
            acc[item].count++;
          }
        }
        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderModalData,
      ingredientsInfo,
      date: new Date(orderModalData.createdAt),
      total
    };
  }, [orderModalData, ingredients]);

  if (!orderInfo || orderRequest) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
