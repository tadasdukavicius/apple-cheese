-- Sample catalogue with Unsplash stock images (placeholders until real product photos exist).
-- Prices are in EUR.

insert into public.products (name, description, price, image_url, category, features) values
(
  'Premium Apple Selection',
  'High quality organic apples sourced from local farms. Perfect for snacking or baking.',
  12.90,
  'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80',
  'apples',
  array['Organic certified', 'Locally sourced', 'Fresh picked', 'Premium quality']
),
(
  'Artisan Cheese Collection',
  'Farmhouse cheese wheels aged to perfection by small local producers.',
  34.50,
  'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80',
  'cheese',
  array['Artisan made', 'Aged to perfection', 'Rich flavor', 'Multiple varieties']
),
(
  'Apple & Cheese Gift Box',
  'Our finest apples and cheeses together in an elegant box, perfect for gifting.',
  49.00,
  'https://images.unsplash.com/photo-1452251889946-8ff5ea7b27ab?w=800&q=80',
  'gifts',
  array['Gift ready', 'Premium selection', 'Perfect pairing', 'Elegant packaging']
),
(
  'Blue Cheese Reserve',
  'Creamy blue cheese served best with figs, walnuts and a crisp apple.',
  18.90,
  'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&q=80',
  'cheese',
  array['Creamy texture', 'Bold flavor', 'Small batch']
),
(
  'Aged Cheddar Selection',
  'Sharp, crumbly aged cheddar cut into snack-sized pieces.',
  16.50,
  'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=800&q=80',
  'cheese',
  array['Aged 18 months', 'Naturally crumbly', 'Great with apples']
),
(
  'Single Orchard Red Apples',
  'Crisp, sweet red apples from a single orchard, picked at peak ripeness.',
  8.90,
  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80',
  'apples',
  array['Single orchard', 'Crisp and sweet', 'Seasonal']
);
