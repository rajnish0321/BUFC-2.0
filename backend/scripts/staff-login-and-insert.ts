import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcndolvwbsafrcqqwood.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbmRvbHZ3YnNhZnJjcXF3b29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDgyMDY5MCwiZXhwIjoyMDYwMzk2NjkwfQ.l4J2bXgdW9Czy96jDcGqqjcuhLK0UxKCtOb_Hi6cCJo';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function staffLoginAndInsert() {
  console.log('Starting staff login and menu item insertion...');

  try {
    // Step 1: Get staff user
    console.log('\nGetting staff user...');
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Failed to get users:', usersError.message);
      return false;
    }

    const staffUser = users.find(user => 
      user.email === 'staff@bufc.com' && 
      user.user_metadata?.role === 'staff'
    );

    if (!staffUser) {
      console.error('❌ Staff user not found');
      return false;
    }

    console.log('✅ Found staff user');
    console.log('User ID:', staffUser.id);
    console.log('Role:', staffUser.user_metadata.role);

    // Step 2: Insert menu items
    console.log('\nInserting menu items...');
    const { data, error } = await supabase
      .from('menu_items')
      .insert([
        {
          name: 'Chicken Kathi Roll',
          description: 'Tender chicken pieces wrapped in a soft paratha with onions and chutney',
          price: 80.00,
          category: 'Kathi Rolls',
          stall_name: 'Kathi Junction',
          is_available: true
        },
        {
          name: 'Paneer Kathi Roll',
          description: 'Cottage cheese cubes wrapped in a soft paratha with onions and chutney',
          price: 70.00,
          category: 'Kathi Rolls',
          stall_name: 'Kathi Junction',
          is_available: true
        },
        {
          name: 'Egg Kathi Roll',
          description: 'Scrambled eggs wrapped in a soft paratha with onions and chutney',
          price: 60.00,
          category: 'Kathi Rolls',
          stall_name: 'Kathi Junction',
          is_available: true
        },
        {
          name: 'Veg Kathi Roll',
          description: 'Mixed vegetables wrapped in a soft paratha with onions and chutney',
          price: 50.00,
          category: 'Kathi Rolls',
          stall_name: 'Kathi Junction',
          is_available: true
        },
        {
          name: 'Double Chicken Kathi Roll',
          description: 'Extra chicken pieces wrapped in a soft paratha with onions and chutney',
          price: 100.00,
          category: 'Kathi Rolls',
          stall_name: 'Kathi Junction',
          is_available: true
        }
      ]);

    if (error) {
      console.error('❌ Error inserting menu items:', error);
      return false;
    }

    console.log('✅ Menu items inserted successfully');

    // Step 3: Verify the insertion
    console.log('\nVerifying menu items...');
    const { data: menuItems, error: verifyError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('stall_name', 'Kathi Junction');

    if (verifyError) {
      console.error('❌ Error verifying menu items:', verifyError);
      return false;
    }

    console.log(`✅ Found ${menuItems.length} menu items for Kathi Junction`);
    console.log('Menu items:');
    menuItems.forEach(item => {
      console.log(`- ${item.name}: ₹${item.price}`);
    });

    return true;
  } catch (error) {
    console.error('❌ Operation failed:', error);
    return false;
  }
}

// Run the function
staffLoginAndInsert().then((success) => {
  console.log('\nOperation summary:', success ? '✅ Completed successfully' : '❌ Failed');
  process.exit(success ? 0 : 1);
}); 