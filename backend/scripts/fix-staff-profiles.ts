import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixStaffProfiles() {
  console.log('Checking for staff users without profiles...');
  
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      throw usersError;
    }

    // Filter for staff users
    const staffUsers = users.users.filter(user => 
      user.user_metadata?.role === 'staff'
    );

    console.log(`Found ${staffUsers.length} staff users`);

    // Check each staff user for a profile
    for (const user of staffUsers) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error(`Error checking profile for user ${user.email}:`, profileError);
        continue;
      }

      if (!profile) {
        console.log(`Creating profile for staff user ${user.email}`);
        
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            name: user.user_metadata?.name || 'Staff Member',
            stall_name: user.user_metadata?.stall_name || 'Default Stall',
            role: 'staff'
          });

        if (insertError) {
          console.error(`Error creating profile for ${user.email}:`, insertError);
        } else {
          console.log(`Successfully created profile for ${user.email}`);
        }
      } else {
        console.log(`Profile already exists for ${user.email}`);
      }
    }

    console.log('Operation completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixStaffProfiles(); 