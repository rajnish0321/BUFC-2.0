-- Begin transaction
BEGIN;

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.user_profiles;

-- Create insert policy for user_profiles
CREATE POLICY "Enable insert for authenticated users"
    ON public.user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        -- Users can only create their own profile
        auth.uid() = id
        AND (
            -- Students can create student profiles
            (
                role = 'student'
                AND (auth.jwt() ->> 'role')::text = 'student'
                AND stall_name IS NULL
            )
            OR
            -- Staff can create staff profiles
            (
                role = 'staff'
                AND (auth.jwt() ->> 'role')::text = 'staff'
                AND stall_name IS NOT NULL
            )
        )
    );

-- Commit transaction
COMMIT; 