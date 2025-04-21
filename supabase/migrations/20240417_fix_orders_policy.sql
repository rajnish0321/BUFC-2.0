-- Begin transaction
BEGIN;

-- Drop existing policy
DROP POLICY IF EXISTS "Enable update access for staff" ON public.orders;

-- Create updated policy with correct metadata field name
CREATE POLICY "Enable update access for staff"
    ON public.orders
    FOR UPDATE
    TO authenticated
    USING (
        -- Check if the user is staff and the order belongs to their stall
        (auth.jwt() ->> 'role')::text = 'staff' AND 
        (auth.jwt() ->> 'stall_name')::text = stall_name
    )
    WITH CHECK (
        -- Check if the user is staff and the order belongs to their stall
        (auth.jwt() ->> 'role')::text = 'staff' AND 
        (auth.jwt() ->> 'stall_name')::text = stall_name
    );

-- Commit transaction
COMMIT; 