const activeOrders = orders.filter(order => 
  ['pending', 'preparing', 'ready'].includes(order.status)
);

const completedOrders = orders.filter(order => 
  order.status === 'completed'
);

const cancelledOrders = orders.filter(order => 
  order.status === 'cancelled'
); 