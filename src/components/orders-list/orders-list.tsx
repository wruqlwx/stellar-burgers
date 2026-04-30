import { FC, memo } from 'react';
import { TOrder } from '@utils-types';
import { OrdersListUI } from '../ui/orders-list';

export const OrdersList: FC<{ orders: TOrder[] }> = memo(({ orders }) => {
  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <OrdersListUI orderByDate={orderByDate} />;
});
