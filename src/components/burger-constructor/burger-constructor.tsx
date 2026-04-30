import { FC, useMemo } from 'react';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { clearOrder, orderBurger } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bun, ingredients } = useSelector((state) => state.constructorSlice);
  const { user } = useSelector((state) => state.user);
  const { orderRequest, orderModalData } = useSelector((state) => state.order);

  const onOrderClick = () => {
    if (!user) return navigate('/login');
    if (!bun || orderRequest) return;

    const dataToOrder = [
      bun._id,
      ...ingredients.map((ing: TConstructorIngredient) => ing._id),
      bun._id
    ];
    dispatch(orderBurger(dataToOrder));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
