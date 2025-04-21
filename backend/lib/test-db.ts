import { supabase } from './supabase';

async function testDatabaseConnection() {
  console.log('Testing Supabase connection...');

  try {
    // Test 1: Basic connection
    const { data: test1, error: error1 } = await supabase.from('orders').select('*').limit(1);
    console.log('Connection test:', error1 ? '❌ Failed' : '✅ Successful');
    if (error1) console.error('Connection error:', error1.message);

    // Test 2: Check if tables exist
    console.log('\nVerifying tables...');
    
    // Check outlets table
    const { data: outlets, error: outletsError } = await supabase
      .from('outlets')
      .select('*')
      .limit(1);
    console.log('Outlets table:', outletsError ? '❌ Failed' : '✅ Exists');
    
    // Check menu_items table
    const { data: menuItems, error: menuItemsError } = await supabase
      .from('menu_items')
      .select('*')
      .limit(1);
    console.log('Menu items table:', menuItemsError ? '❌ Failed' : '✅ Exists');
    
    // Check orders table
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    console.log('Orders table:', ordersError ? '❌ Failed' : '✅ Exists');
    
    // Check user_profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    console.log('User profiles table:', profilesError ? '❌ Failed' : '✅ Exists');

    // Test 3: Authentication
    const { data: test2, error: error2 } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'test123456',
      options: {
        data: {
          name: 'Test User',
          role: 'student'
        }
      }
    });
    console.log('\nAuth test:', error2 ? '❌ Failed' : '✅ Successful');
    if (error2) console.error('Auth error:', error2.message);

    return true;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}

export { testDatabaseConnection }; 