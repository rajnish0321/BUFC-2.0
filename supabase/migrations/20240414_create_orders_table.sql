-- Drop existing table if it exists
DROP TABLE IF EXISTS public.orders;

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    items JSONB NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
    stall_name TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.orders;
DROP POLICY IF EXISTS "Enable update access for users based on role" ON public.orders;

-- Create policies
CREATE POLICY "Enable read access for all users"
    ON public.orders
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON public.orders
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for staff"
    ON public.orders
    FOR UPDATE
    TO authenticated
    USING (
        -- Check if the user is staff and the order belongs to their stall
        (auth.jwt() ->> 'role')::text = 'staff' AND 
        (auth.jwt() ->> 'stallName')::text = stall_name
    )
    WITH CHECK (
        -- Check if the user is staff and the order belongs to their stall
        (auth.jwt() ->> 'role')::text = 'staff' AND 
        (auth.jwt() ->> 'stallName')::text = stall_name
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_stall_name ON public.orders(stall_name);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status); 