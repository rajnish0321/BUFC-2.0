-- First, delete all existing outlets
DELETE FROM public.outlets;

-- Insert the correct outlets
INSERT INTO public.outlets (name, description, is_active) VALUES
  ('Kathi Junction', 'Delicious rolls, wraps & more. The most popular spot on campus!', true),
  ('Southern', 'Authentic South Indian cuisine with a wide variety of dosas and more.', true),
  ('SnapEats', 'Quick bites, refreshing beverages, and healthy snack options.', true),
  ('Dominos', 'Everyone''s favorite pizza, delivered fresh and hot to your slot.', true); 