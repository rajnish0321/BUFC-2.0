import { supabase } from '../lib/supabase';

async function createStaffUser() {
  console.log('Checking if staff user exists...');

  try {
    // First check if the user already exists by trying to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'staff@bufc.com',
      password: 'Staff@123'
    });

    if (signInData?.user) {
      console.log('✅ Staff user already exists and credentials are correct');
      console.log('Email: staff@bufc.com');
      console.log('Password: Staff@123');
      console.log('You can use these credentials to log in.');
      
      // Check if user profile exists
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', signInData.user.id)
        .single();
      
      if (!profile && !profileError) {
        console.log('Creating user profile for existing user...');
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: signInData.user.id,
            name: 'Staff User',
            role: 'staff',
            stall_name: 'Kathi Junction'
          });
        
        if (insertError) {
          console.error('Error creating user profile:', insertError);
        } else {
          console.log('✅ User profile created successfully');
        }
      }
      
      return true;
    }

    // If sign in failed, check if it's because the password is wrong
    if (signInError && signInError.message.includes('Invalid login credentials')) {
      console.log('⚠️ Staff user exists but password is incorrect');
      console.log('Email: staff@bufc.com');
      console.log('Please use the Supabase dashboard to reset the password');
      console.log('Or run: npx tsx src/scripts/reset-staff-password.ts');
      return false;
    }

    // If user doesn't exist, try to sign up
    console.log('Staff user not found. Creating new staff user...');
    const { data, error } = await supabase.auth.signUp({
      email: 'staff@bufc.com',
      password: 'Staff@123',
      options: {
        data: {
          name: 'Staff User',
          role: 'staff',
          stall_name: 'Kathi Junction'
        }
      }
    });

    if (error) {
      // Check if the error is because the email is already in use
      if (error.message.includes('already registered')) {
        console.log('⚠️ Email already registered but password is incorrect');
        console.log('Please use the Supabase dashboard to reset the password for staff@bufc.com');
        console.log('Or run: npx tsx src/scripts/reset-staff-password.ts');
        return false;
      }
      
      console.error('Error creating staff user:', error);
      return false;
    }

    console.log('✅ Staff user created successfully');
    console.log('Email: staff@bufc.com');
    console.log('Password: Staff@123');
    console.log('Please check your email to verify the account.');
    
    // Create user profile in the database
    if (data.user) {
      console.log('Creating user profile in database...');
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          name: 'Staff User',
          role: 'staff',
          stall_name: 'Kathi Junction'
        });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
      } else {
        console.log('✅ User profile created successfully');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to create staff user:', error);
    return false;
  }
}

// Run the function
createStaffUser().then((success) => {
  console.log('\nOperation summary:', success ? '✅ Completed successfully' : '❌ Failed');
  process.exit(success ? 0 : 1);
}); 