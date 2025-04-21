-- Begin transaction
BEGIN;

-- Drop existing staff order policies
DROP POLICY IF EXISTS "Staff can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
DROP POLICY IF EXISTS "Students can create orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can view their outlet orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can update their outlet orders" ON public.orders;

-- Create new staff order policies with outlet restrictions
CREATE POLICY "Staff can view their outlet orders"
    ON public.orders
    FOR SELECT
    TO authenticated
    USING (
        (
            -- Staff can only view orders for their outlet
            EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data->>'role' = 'staff'
                AND auth.users.raw_user_meta_data->>'stallName' = stall_name
            )
        ) OR
        -- Students can view their own orders
        (
            EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data->>'role' = 'student'
                AND auth.users.id = user_id
            )
        )
    );

CREATE POLICY "Staff can update their outlet orders"
    ON public.orders
    FOR UPDATE
    TO authenticated
    USING (
        -- Staff can only update orders for their outlet
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'staff'
            AND auth.users.raw_user_meta_data->>'stallName' = stall_name
        )
    )
    WITH CHECK (
        -- Staff can only update orders for their outlet
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'staff'
            AND auth.users.raw_user_meta_data->>'stallName' = stall_name
        )
    );

-- Create policy for students to create orders
CREATE POLICY "Students can create orders"
    ON public.orders
    FOR INSERT
    TO authenticated
    WITH CHECK (
        -- Only students can create orders
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'student'
        )
    );

-- Create policy for students to delete their pending orders
CREATE POLICY "Students can delete their pending orders"
    ON public.orders
    FOR DELETE
    TO authenticated
    USING (
        -- Students can only delete their own pending orders
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'student'
            AND auth.users.id = user_id
            AND status = 'pending'
        )
    );

-- Commit transaction
COMMIT; 