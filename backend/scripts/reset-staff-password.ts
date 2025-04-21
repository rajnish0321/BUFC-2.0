import { supabase } from '../lib/supabase';

async function resetStaffPassword() {
  console.log('Resetting staff password...');

  try {
    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail('staff@bufc.com', {
      redirectTo: 'http://localhost:5173/reset-password',
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }

    console.log('✅ Password reset email sent successfully');
    console.log('Please check your email for the password reset link.');
    console.log('Email: staff@bufc.com');
    
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}

// Run the function
resetStaffPassword().then((success) => {
  console.log('\nOperation summary:', success ? '✅ Completed successfully' : '❌ Failed');
  process.exit(success ? 0 : 1);
}); 