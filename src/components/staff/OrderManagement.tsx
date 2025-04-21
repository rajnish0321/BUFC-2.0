import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Clock, MapPin, Phone, User, Package, CheckCircle2, XCircle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_location: string;
  items: Array<{
    name: string;
    quantity: number;
    special_instructions?: string;
  }>;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  created_at: string;
  estimated_delivery_time: string;
};

const OrderManagement = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    fetchOrders();
    // Set up real-time subscription for order updates
    const subscription = supabase
      .channel('orders')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders',
        filter: `stall_name=eq.${user.stallName}`
      }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.stallName) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('stall_name', user.stallName)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    if (!user?.stallName) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .eq('stall_name', user.stallName);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${newStatus}`,
      });

      // Refresh orders after update
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'preparing':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">Loading orders...</div>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-bufc-blue">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-bold">
                            Order #{order.id}
                          </CardTitle>
                          <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{order.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{order.customer_phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{order.delivery_location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{order.estimated_delivery_time}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-semibold mb-2">Items:</h4>
                          <ul className="space-y-2">
                            {order.items.map((item, index) => (
                              <li key={index} className="flex justify-between">
                                <span>{item.quantity}x {item.name}</span>
                                {item.special_instructions && (
                                  <span className="text-sm text-gray-500">
                                    Note: {item.special_instructions}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        {order.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              Start Preparing
                            </Button>
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              variant="destructive"
                            >
                              Cancel Order
                            </Button>
                          </>
                        )}
                        {order.status === 'preparing' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Mark Ready
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="bg-gray-500 hover:bg-gray-600"
                          >
                            Complete Order
                          </Button>
                        )}
                        {order.status === 'completed' && (
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle2 className="h-5 w-5" />
                            <span>Order Completed</span>
                          </div>
                        )}
                        {order.status === 'cancelled' && (
                          <div className="flex items-center gap-2 text-red-500">
                            <XCircle className="h-5 w-5" />
                            <span>Order Cancelled</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}; 