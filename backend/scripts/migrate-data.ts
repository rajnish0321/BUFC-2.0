import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcndolvwbsafrcqqwood.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbmRvbHZ3YnNhZnJjcXF3b29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDgyMDY5MCwiZXhwIjoyMDYwMzk2NjkwfQ.l4J2bXgdW9Czy96jDcGqqjcuhLK0UxKCtOb_Hi6cCJo';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrateData() {
  try {
    // Get all users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;

    // Migrate user profiles
    for (const user of users) {
      // Convert stall name to match the outlet name exactly
      let stallName = user.user_metadata?.stallName;
      if (stallName?.toLowerCase() === 'kathi-junction' || stallName?.toLowerCase() === 'kathi junction') {
        stallName = 'Kathi Junction';
      }

      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          name: user.user_metadata?.name || 'Unknown User',
          role: user.user_metadata?.role || 'student',
          stall_name: stallName,
          phone: user.user_metadata?.phone || null
        });

      if (profileError) {
        console.error(`Error migrating profile for user ${user.id}:`, profileError);
      }
    }

    // Get all orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*');

    if (ordersError) throw ordersError;

    // Migrate orders
    for (const order of orders) {
      // Convert stall name to match the outlet name exactly
      let stallName = order.stall_name;
      if (stallName?.toLowerCase() === 'kathi-junction' || stallName?.toLowerCase() === 'kathi junction') {
        stallName = 'Kathi Junction';
      }

      const { error: orderError } = await supabase
        .from('orders')
        .upsert({
          id: order.id,
          user_id: order.user_id,
          items: order.items,
          total: order.total,
          status: order.status,
          stall_name: stallName,
          payment_method: order.payment_method || 'cash',
          created_at: order.created_at,
          updated_at: order.updated_at
        });

      if (orderError) {
        console.error(`Error migrating order ${order.id}:`, orderError);
      }
    }

    console.log('Data migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

migrateData(); 