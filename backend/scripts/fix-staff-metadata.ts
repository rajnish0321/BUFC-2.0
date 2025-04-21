import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = 'https://fcndolvwbsafrcqqwood.supabase.co'
// Hardcode the key temporarily for testing
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbmRvbHZ3YnNhZnJjcXF3b29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDgyMDY5MCwiZXhwIjoyMDYwMzk2NjkwfQ.l4J2bXgdW9Czy96jDcGqqjcuhLK0UxKCtOb_Hi6cCJo'

console.log('Using Supabase URL:', supabaseUrl)
console.log('Service Role Key loaded:', !!supabaseKey)

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
})

const outletNames = {
  'kathi-junction': 'Kathi Junction',
  'southern': 'Southern',
  'snapeats': 'SnapEats',
  'dominos': 'Dominos'
}

async function fixStaffMetadata() {
  try {
    console.log('Fetching staff users...')
    
    // First, get all users from the user_profiles table with role = 'staff'
    const { data: staffProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'staff')

    if (profilesError) {
      throw profilesError
    }

    console.log(`Found ${staffProfiles.length} staff profiles`)

    for (const profile of staffProfiles) {
      console.log(`Processing user profile for ID: ${profile.id}`)
      
      const stallId = profile.stall_name
      if (!stallId) {
        console.error(`No stall name found for user ID ${profile.id}`)
        continue
      }

      // Convert stall ID to exact name if needed
      const stallName = outletNames[stallId as keyof typeof outletNames] || stallId

      // Update user metadata using auth.updateUser
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        profile.id,
        {
          user_metadata: {
            role: 'staff',
            stall_name: stallName
          }
        }
      )

      if (updateError) {
        console.error(`Error updating metadata for user ID ${profile.id}:`, updateError)
        continue
      }

      // Get user details to get their name
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(profile.id)
      
      if (userError || !user) {
        console.error(`Error getting user details for ID ${profile.id}:`, userError)
        continue
      }

      // Update user profile with name
      const { error: profileUpdateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: profile.id,
          name: user.user_metadata?.name || 'Staff User',  // Use metadata name or default
          role: 'staff',
          stall_name: stallName,
          updated_at: new Date().toISOString()
        })

      if (profileUpdateError) {
        console.error(`Error updating profile for user ID ${profile.id}:`, profileUpdateError)
        continue
      }

      console.log(`Successfully updated metadata and profile for user ID ${profile.id}`)
    }

    console.log('Finished processing all staff users')
  } catch (error) {
    console.error('Error in fixStaffMetadata:', error)
  }
}

fixStaffMetadata()