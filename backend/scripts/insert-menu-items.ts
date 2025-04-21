import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const menuItems = [
  // Kathi Junction Items
  {
    name: 'Paneer Kathi Roll',
    description: 'Soft paneer with spices wrapped in a fresh paratha.',
    price: 120,
    category: 'rolls',
    stall_name: 'Kathi Junction',
    image_url: 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&q=80&w=500',
    is_available: true
  },
  {
    name: 'Chicken Kathi Roll',
    description: 'Juicy chicken pieces marinated with spices and wrapped in a fresh paratha.',
    price: 150,
    category: 'rolls',
    stall_name: 'Kathi Junction',
    image_url: 'https://images.unsplash.com/photo-1576488489579-6967c02c56fc?auto=format&fit=crop&q=80&w=500',
    is_available: true
  },
  {
    name: 'Egg Kathi Roll',
    description: 'Delicious egg wrap with vegetables and special spices.',
    price: 100,
    category: 'rolls',
    stall_name: 'Kathi Junction',
    image_url: 'https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?auto=format&fit=crop&q=80&w=500',
    is_available: true
  },
  {
    name: 'French Fries',
    description: 'Crispy golden fries served with ketchup.',
    price: 80,
    category: 'sides',
    stall_name: 'Kathi Junction',
    image_url: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80&w=500',
    is_available: true
  },

  // Southern Items
  {
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato filling.',
    price: 100,
    category: 'dosa',
    stall_name: 'Southern',
    image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=500',
    is_available: true
  },
  {
    name: 'Idli Sambar',
    description: 'Soft steamed rice cakes served with lentil soup and chutneys.',
    price: 80,
    category: 'breakfast',
    stall_name: 'Southern',
    image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=500',
    is_available: true
  },
  {
    name: 'Vada',
    description: 'Crispy lentil fritters served with sambar and chutneys.',
    price: 60,
    category: 'snacks',
    stall_name: 'Southern',
    image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=500',
    is_available: true
  },

  // SnapEats Items
  {
    name: 'Chicken Burger',
    description: 'Juicy chicken patty with fresh vegetables in a soft bun.',
    price: 120,
    category: 'burgers',
    stall_name: 'SnapEats',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500',
    is_available: true
  },
  {
    name: 'Veg Burger',
    description: 'Plant-based patty with fresh vegetables in a soft bun.',
    price: 100,
    category: 'burgers',
    stall_name: 'SnapEats',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500',
    is_available: true
  },
  {
    name: 'French Fries',
    description: 'Crispy golden fries with seasoning.',
    price: 80,
    category: 'sides',
    stall_name: 'SnapEats',
    image_url: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80&w=500',
    is_available: true
  },

  // Dominos Items
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce and mozzarella cheese.',
    price: 200,
    category: 'pizza',
    stall_name: 'Dominos',
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=500',
    is_available: true
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Pizza topped with pepperoni and extra cheese.',
    price: 250,
    category: 'pizza',
    stall_name: 'Dominos',
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=500',
    is_available: true
  },
  {
    name: 'Chicken Wings',
    description: 'Spicy chicken wings with dipping sauce.',
    price: 180,
    category: 'sides',
    stall_name: 'Dominos',
    image_url: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&q=80&w=500',
    is_available: true
  }
];

async function insertMenuItems() {
  console.log('Starting to insert menu items...');

  try {
    // First, delete all existing menu items
    const { error: deleteError } = await supabase
      .from('menu_items')
      .delete()
      .neq('name', ''); // Delete all menu items

    if (deleteError) {
      throw deleteError;
    }

    console.log('✅ Successfully cleared existing menu items');

    // Insert the menu items
    const { error: insertError } = await supabase
      .from('menu_items')
      .insert(menuItems);

    if (insertError) {
      throw insertError;
    }

    console.log('✅ Successfully inserted menu items');

    // Verify the menu items
    const { data: verifiedItems, error: verifyError } = await supabase
      .from('menu_items')
      .select('*')
      .order('stall_name');

    if (verifyError) {
      throw verifyError;
    }

    console.log('\nCurrent menu items in database:');
    verifiedItems?.forEach(item => {
      console.log(`- ${item.name} (${item.stall_name}) - ₹${item.price}`);
    });

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

// Run the function
insertMenuItems().then((success) => {
  console.log('\nOperation summary:', success ? '✅ Completed successfully' : '❌ Failed');
}); 