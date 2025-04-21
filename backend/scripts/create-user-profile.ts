import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcndolvwbsafrcqqwood.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbmRvbHZ3YnNhZnJjcXF3b29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDgyMDY5MCwiZXhwIjoyMDYwMzk2NjkwfQ.l4J2bXgdW9Czy96jDcGqqjcuhLK0UxKCtOb_Hi6cCJo';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createUserProfile() {
  try {
    // Get all users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error getting users:', usersError.message);
      return;
    }

    console.log(`Found ${users.length} users`);

    // Process each user
    for (const user of users) {
      // Skip users without metadata
      if (!user.user_metadata) {
        console.log(`Skipping user ${user.email} - no metadata`);
        continue;
      }

      const { role, name, stallName } = user.user_metadata;

      // Skip users without a role
      if (!role) {
        console.log(`Skipping user ${user.email} - no role`);
        continue;
      }

      // Check if profile already exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && !profileError.message.includes('No rows found')) {
        console.error(`Error checking profile for ${user.email}:`, profileError.message);
        continue;
      }

      if (existingProfile) {
        console.log(`Profile already exists for ${user.email}`);
        continue;
      }

      // Create profile based on role
      const profileData = {
        id: user.id,
        name: name || user.email,
        role: role,
        stall_name: role === 'staff' ? stallName : null
      };

      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert(profileData);

      if (insertError) {
        console.error(`Error creating profile for ${user.email}:`, insertError.message);
        continue;
      }

      console.log(`Created profile for ${user.email}`);
    }

    console.log('User profile creation completed');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
createUserProfile(); 