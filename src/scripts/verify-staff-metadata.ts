import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://aqfqpwxmxjbfvxqffgxg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZnFwd3hteGpiZnZ4cWZmZ3hnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTk4NzI5OCwiZXhwIjoyMDI1NTYzMjk4fQ.Hs_Yx_Ky_qXJFVGBEZHFPXGVxVhOYXxTYGhkJ2KV5Oc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyStaffMetadata() {
  try {
    // Get the staff user by email
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('Error getting users:', usersError);
      return;
    }

    const staffUser = users.find(user => user.email === 'staff@bufc.com');

    if (!staffUser) {
      console.error('Staff user not found');
      return;
    }

    console.log('Current user metadata:', staffUser.user_metadata);

    // Create new metadata without stall_name
    const newMetadata = {
      name: 'Staff User',
      role: 'staff',
      email: 'staff@bufc.com',
      email_verified: true
    };

    // Update the user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      staffUser.id,
      {
        user_metadata: newMetadata
      }
    );

    if (updateError) {
      console.error('Error updating staff metadata:', updateError);
      return;
    }

    console.log('Staff metadata updated successfully');
  } catch (error) {
    console.error('Error in verifyStaffMetadata:', error);
  }
}

verifyStaffMetadata(); 