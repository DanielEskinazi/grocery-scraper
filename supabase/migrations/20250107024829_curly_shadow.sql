/*
  # Grocery Items Schema

  1. New Tables
    - `grocery_items`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `category` (text, required)
      - `image_url` (text)
      - `unit` (text, required) - e.g., 'lb', 'oz', 'ea'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `grocery_items` table
    - Add policies for authenticated users to read all items
*/

CREATE TABLE grocery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  image_url text,
  unit text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE grocery_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON grocery_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert items"
  ON grocery_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create an update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_grocery_items_updated_at
  BEFORE UPDATE ON grocery_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();