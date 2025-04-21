import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcndolvwbsafrcqqwood.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbmRvbHZ3YnNhZnJjcXF3b29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDgyMDY5MCwiZXhwIjoyMDYwMzk2NjkwfQ.l4J2bXgdW9Czy96jDcGqqjcuhLK0UxKCtOb_Hi6cCJo';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function verifyStaffMetadata() {
  try {
    // Get staff user
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error getting users:', usersError.message);
      return;
    }

    const staffUser = users.find(user => 
      user.email === 'staff@bufc.com' && 
      user.user_metadata?.role === 'staff'
    );

    if (!staffUser) {
      console.error('Staff user not found');
      return;
    }

    console.log('Current user metadata:', staffUser.user_metadata);

    // Always update to ensure clean metadata
    console.log('Updating staff metadata...');
    
    // Update user metadata with only the required fields
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      staffUser.id,
      {
        user_metadata: {
          name: 'Staff User',
          role: 'staff',
          stallName: 'Kathi Junction',
          email: 'staff@bufc.com',
          email_verified: true
        }
      }
    );

    if (updateError) {
      console.error('Error updating user metadata:', updateError.message);
      return;
    }

    console.log('Staff metadata updated successfully');

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the verification
verifyStaffMetadata(); 