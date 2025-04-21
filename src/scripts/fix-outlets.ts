import { supabase } from '../lib/supabase';

const outlets = [
  {
    name: 'Kathi Junction',
    description: 'Delicious rolls, wraps & more. The most popular spot on campus!',
    is_active: true
  },
  {
    name: 'Southern',
    description: 'Authentic South Indian cuisine with a wide variety of dosas and more.',
    is_active: true
  },
  {
    name: 'SnapEats',
    description: 'Quick bites, refreshing beverages, and healthy snack options.',
    is_active: true
  },
  {
    name: 'Dominos',
    description: 'Everyone\'s favorite pizza, delivered fresh and hot to your slot.',
    is_active: true
  }
];

async function fixOutlets() {
  console.log('Starting to fix outlets...');

  try {
    // First, delete all existing outlets
    const { error: deleteError } = await supabase
      .from('outlets')
      .delete()
      .neq('name', ''); // Delete all outlets

    if (deleteError) {
      throw deleteError;
    }

    console.log('✅ Successfully cleared existing outlets');

    // Insert the correct outlets
    const { error: insertError } = await supabase
      .from('outlets')
      .insert(outlets);

    if (insertError) {
      throw insertError;
    }

    console.log('✅ Successfully inserted correct outlets');

    // Verify the outlets
    const { data: verifiedOutlets, error: verifyError } = await supabase
      .from('outlets')
      .select('*')
      .order('name');

    if (verifyError) {
      throw verifyError;
    }

    console.log('\nCurrent outlets in database:');
    verifiedOutlets?.forEach(outlet => {
      console.log(`- ${outlet.name} (${outlet.is_active ? 'Active' : 'Inactive'})`);
    });

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

// Run the function
fixOutlets().then((success) => {
  console.log('\nOperation summary:', success ? '✅ Completed successfully' : '❌ Failed');
}); 