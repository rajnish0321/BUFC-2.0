import { supabase } from './supabase';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

// ... existing code ...