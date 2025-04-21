import { supabase } from './supabase';
import { createClient } from '@supabase/supabase-js';

// Create a service role client for admin operations
const supabaseAdmin = createClient(
  'https://fcndolvwbsafrcqqwood.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbmRvbHZ3YnNhZnJjcXF3b29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDgyMDY5MCwiZXhwIjoyMDYwMzk2NjkwfQ.l4J2bXgdW9Czy96jDcGqqjcuhLK0UxKCtOb_Hi6cCJo',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  stall_name: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

// Map of outlet IDs to their exact names in the database
const outletNames = {
  'kathi-junction': 'Kathi Junction',
  'southern': 'Southern',
  'snapeats': 'SnapEats',
  'dominos': 'Dominos'
};

export const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('Attempting to create order:', order);
    
    // Validate required fields
    if (!order.user_id) throw new Error('User ID is required');
    if (!order.items || order.items.length === 0) throw new Error('Order must contain at least one item');
    if (!order.stall_name) throw new Error('Stall name is required');
    if (!order.payment_method) throw new Error('Payment method is required');
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error('Authentication error: ' + userError.message);
    if (!user) throw new Error('No authenticated user found');
    
    // Verify user is a student
    if (user.user_metadata?.role !== 'student') {
      throw new Error('Only students can create orders');
    }
    
    // Ensure user profile exists using service role client
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', user.id);
      
    if (profileError) {
      throw new Error('Error checking user profile: ' + profileError.message);
    }
    
    if (!profiles || profiles.length === 0) {
      // Create user profile if it doesn't exist using service role client
      const { error: createProfileError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: user.id,
          name: user.user_metadata?.name || user.email,
          role: 'student'
        });
        
      if (createProfileError) {
        throw new Error('Error creating user profile: ' + createProfileError.message);
      }
    }

    // Get the correct outlet name from the map
    const correctStallName = outletNames[order.stall_name as keyof typeof outletNames];
    if (!correctStallName) {
      throw new Error('Invalid stall name. Please select a valid outlet.');
    }
    
    // Create the order with the correct stall name
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: order.user_id,
          items: order.items,
          total: order.total,
          status: order.status || 'pending',
          stall_name: correctStallName,
          payment_method: order.payment_method
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw new Error(error.message || 'Failed to create order');
    }

    if (!data) {
      throw new Error('No data returned after creating order');
    }

    console.log('Order created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user found');

    // Get user profile to check role and stall assignment
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;
    
    const isStaff = userProfile?.role === 'staff';
    console.log('Fetching orders for:', {
      userId,
      isStaff,
      userProfile,
      metadata: user.user_metadata
    });

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (isStaff && userProfile?.stall_name) {
      // Staff can only see orders for their outlet
      console.log('Filtering orders for stall:', userProfile.stall_name);
      query = query.eq('stall_name', userProfile.stall_name);
    } else {
      // Students can only see their own orders
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    console.log('Orders fetched:', data);
    return data || [];
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  try {
    console.log('Starting order status update process...', { orderId, status });

    // Step 1: Get the current user and their role/stall information
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Authentication error:', userError);
      throw new Error(`Authentication failed: ${userError.message}`);
    }

    if (!userData.user) {
      console.error('No user found');
      throw new Error('No authenticated user found');
    }

    // Step 2: Get user profile from user_profiles table
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      throw new Error(`Failed to fetch user profile: ${profileError.message}`);
    }

    if (!userProfile) {
      console.error('No user profile found');
      throw new Error('User profile not found in the database');
    }

    // Step 3: Verify staff role and stall assignment
    if (userProfile.role !== 'staff') {
      console.error('User is not staff:', { role: userProfile.role });
      throw new Error('Only staff members can update order status');
    }

    if (!userProfile.stall_name) {
      console.error('Staff has no stall assigned:', userProfile);
      throw new Error('Staff member must be assigned to a stall');
    }

    // Step 4: Get the order to verify stall name
    const { data: order, error: orderFetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderFetchError) {
      console.error('Error fetching order:', orderFetchError);
      throw new Error(`Failed to fetch order: ${orderFetchError.message}`);
    }

    if (!order) {
      console.error('Order not found:', { orderId });
      throw new Error('Order not found');
    }

    // Step 5: Verify stall name matches
    if (order.stall_name !== userProfile.stall_name) {
      console.error('Stall name mismatch:', {
        orderStall: order.stall_name,
        userStall: userProfile.stall_name
      });
      throw new Error('You can only update orders for your assigned stall');
    }

    // Step 6: Update the order status
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('stall_name', userProfile.stall_name)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order status:', updateError);
      throw new Error(`Failed to update order status: ${updateError.message}`);
    }

    if (!updatedOrder) {
      console.error('No data returned after update');
      throw new Error('Failed to update order status: No data returned');
    }

    console.log('Order status updated successfully:', updatedOrder);
    return updatedOrder;
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    // Rethrow the error with the specific message
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
}; 