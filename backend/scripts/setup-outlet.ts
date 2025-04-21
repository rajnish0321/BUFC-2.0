import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcndolvwbsafrcqqwood.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbmRvbHZ3YnNhZnJjcXF3b29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDgyMDY5MCwiZXhwIjoyMDYwMzk2NjkwfQ.l4J2bXgdW9Czy96jDcGqqjcuhLK0UxKCtOb_Hi6cCJo';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupOutlet() {
  try {
    // Create the outlet
    const { error: outletError } = await supabase
      .from('outlets')
      .upsert({
        name: 'Kathi Junction',
        description: 'Best Kathi Rolls in Town',
        is_active: true
      });

    if (outletError) {
      console.error('Error creating outlet:', outletError);
      return;
    }

    console.log('Outlet created successfully');
  } catch (error) {
    console.error('Error in setupOutlet:', error);
  }
}

setupOutlet(); 