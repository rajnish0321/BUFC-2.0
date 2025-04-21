-- Begin transaction
BEGIN;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for users" ON public.orders;
DROP POLICY IF EXISTS "Enable insert access for students" ON public.orders;
DROP POLICY IF EXISTS "Enable update access for staff" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Staff can manage outlets" ON public.outlets;

-- Create updated policies for orders
CREATE POLICY "Enable read access for users"
    ON public.orders
    FOR SELECT
    TO authenticated
    USING (
        -- Staff can view orders for their stall
        (
            EXISTS (
                SELECT 1 FROM public.user_profiles
                WHERE user_profiles.id = auth.uid()
                AND user_profiles.role = 'staff'
                AND user_profiles.stall_name = orders.stall_name
            )
        )
        OR
        -- Students can view their own orders
        (
            auth.uid() = user_id
            AND
            EXISTS (
                SELECT 1 FROM public.user_profiles
                WHERE user_profiles.id = auth.uid()
                AND user_profiles.role = 'student'
            )
        )
    );

CREATE POLICY "Enable insert access for students"
    ON public.orders
    FOR INSERT
    TO authenticated
    WITH CHECK (
        -- Allow students to create orders
        auth.uid() = user_id
        AND
        (
            EXISTS (
                SELECT 1 FROM public.user_profiles
                WHERE user_profiles.id = auth.uid()
                AND user_profiles.role = 'student'
            )
            OR
            (auth.jwt() ->> 'role')::text = 'student'
        )
    );

CREATE POLICY "Enable update access for staff"
    ON public.orders
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'staff'
            AND user_profiles.stall_name = orders.stall_name
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'staff'
            AND user_profiles.stall_name = orders.stall_name
        )
    );

-- Create updated policies for user_profiles
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for new users"
    ON public.user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Create updated policies for outlets
CREATE POLICY "Staff can manage outlets"
    ON public.outlets
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'staff'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'staff'
        )
    );

-- Commit transaction
COMMIT; 