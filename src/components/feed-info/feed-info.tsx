import { FC } from 'react';
import { TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';

export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector((state) => state.feeds);

  const feed = { total, totalToday };

  const readyOrders = orders
    .filter((item: TOrder) => item.status === 'done')
    .map((item: TOrder) => item.number)
    .slice(0, 20);

  const pendingOrders = orders
    .filter((item: TOrder) => item.status === 'pending')
    .map((item: TOrder) => item.number)
    .slice(0, 20);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
