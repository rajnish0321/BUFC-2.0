import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ShoppingBag, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { getUserOrders, updateOrderStatus, Order, OrderStatus } from '@/lib/orders';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();
  const location = useLocation();
  
  // Check if we're in the dashboard
  const isDashboard = location.pathname.includes('/dashboard');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const allOrders = await getUserOrders(user.id);
        setOrders(allOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const activeOrders = orders.filter(order => 
    ['pending', 'preparing', 'ready'].includes(order.status)
  );

  const completedOrders = orders.filter(order => 
    order.status === 'completed'
  );

  const cancelledOrders = orders.filter(order => 
    order.status === 'cancelled'
  );
  
  if (loading) {
    return (
      <MainLayout>
        <div className={`flex items-center justify-center h-64 ${!isDashboard ? 'mt-16' : ''}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bufc-blue"></div>
        </div>
      </MainLayout>
    );
  }

  const content = (
    <div className={`bufc-container py-8 ${!isDashboard ? 'mt-16' : ''}`}>
      <h1 className="text-3xl font-bold mb-8">
        {user?.role === 'staff' ? `Orders - ${user.stallName}` : 'My Orders'}
      </h1>
      
      <Tabs defaultValue="active" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger 
            value="active" 
            className="data-[state=active]:bg-bufc-blue data-[state=active]:text-white"
          >
            Active
          </TabsTrigger>
          <TabsTrigger 
            value="completed" 
            className="data-[state=active]:bg-bufc-blue data-[state=active]:text-white"
          >
            Completed
          </TabsTrigger>
          <TabsTrigger 
            value="cancelled" 
            className="data-[state=active]:bg-bufc-blue data-[state=active]:text-white"
          >
            Cancelled
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {activeOrders.length > 0 ? (
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order}
                  isStaff={user?.role === 'staff'}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No active orders" 
              description="There are no active orders at the moment." 
              icon={<ShoppingBag size={48} className="text-gray-400" />}
            />
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedOrders.length > 0 ? (
            <div className="space-y-4">
              {completedOrders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order}
                  isStaff={user?.role === 'staff'}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No completed orders" 
              description="There are no completed orders yet." 
              icon={<ShoppingBag size={48} className="text-gray-400" />}
            />
          )}
        </TabsContent>
        
        <TabsContent value="cancelled">
          {cancelledOrders.length > 0 ? (
            <div className="space-y-4">
              {cancelledOrders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order}
                  isStaff={user?.role === 'staff'}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No cancelled orders" 
              description="There are no cancelled orders." 
              icon={<AlertCircle size={48} className="text-gray-400" />}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  // If in dashboard, return just the content
  if (isDashboard) {
    return content;
  }

  // If not in dashboard, wrap with MainLayout
  return (
    <MainLayout>
      {content}
    </MainLayout>
  );
};

// Order card component
const OrderCard = ({ 
  order, 
  isStaff,
  onUpdateStatus
}: { 
  order: Order,
  isStaff: boolean,
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>
}) => {
  const statusColors = {
    pending: 'bg-yellow-500',
    preparing: 'bg-bufc-orange',
    ready: 'bg-green-500',
    completed: 'bg-gray-500',
    cancelled: 'bg-red-500'
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">
              Order #{order.id}
            </CardTitle>
            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <Badge className={statusColors[order.status]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">{order.stall_name}</h4>
          <ul className="text-sm space-y-1">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>{item.quantity}x {item.name}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
          <div className="font-semibold">
            Total: ₹{order.total.toFixed(2)}
          </div>
          
          {isStaff && order.status !== 'completed' && order.status !== 'cancelled' && (
            <div className="flex gap-2">
              {order.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onUpdateStatus(order.id, 'preparing')}
                  >
                    Start Preparing
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onUpdateStatus(order.id, 'cancelled')}
                  >
                    Cancel
                  </Button>
                </>
              )}
              {order.status === 'preparing' && (
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(order.id, 'ready')}
                >
                  Mark Ready
                </Button>
              )}
              {order.status === 'ready' && (
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(order.id, 'completed')}
                >
                  Complete Order
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Empty state component
const EmptyState = ({ 
  title, 
  description, 
  icon 
}: { 
  title: string, 
  description: string, 
  icon: React.ReactNode 
}) => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

export default Orders;
