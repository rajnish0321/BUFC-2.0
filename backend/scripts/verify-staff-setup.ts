import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcndolvwbsafrcqqwood.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbmRvbHZ3YnNhZnJjcXF3b29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDgyMDY5MCwiZXhwIjoyMDYwMzk2NjkwfQ.l4J2bXgdW9Czy96jDcGqqjcuhLK0UxKCtOb_Hi6cCJo';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function verifyStaffSetup() {
  try {
    // Get staff user
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;

    const staffUser = users.find(user => user.email === 'staff@bufc.com');
    if (!staffUser) {
      console.error('Staff user not found');
      return;
    }

    // Update user metadata
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
      console.error('Error updating user metadata:', updateError);
      return;
    }

    // Verify user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', staffUser.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return;
    }

    if (!profile) {
      // Create user profile if it doesn't exist
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: staffUser.id,
          name: 'Staff User',
          role: 'staff',
          stall_name: 'Kathi Junction'
        });

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        return;
      }
    } else {
      // Update user profile if it exists
      const { error: updateProfileError } = await supabase
        .from('user_profiles')
        .update({
          name: 'Staff User',
          role: 'staff',
          stall_name: 'Kathi Junction'
        })
        .eq('id', staffUser.id);

      if (updateProfileError) {
        console.error('Error updating user profile:', updateProfileError);
        return;
      }
    }

    console.log('Staff setup verified and updated successfully');
  } catch (error) {
    console.error('Error in verifyStaffSetup:', error);
  }
}

verifyStaffSetup(); 