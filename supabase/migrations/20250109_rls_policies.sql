-- Products policies
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for store managers" ON products
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM stores
      WHERE id = products.store_id
    )
  );

CREATE POLICY "Enable update for store managers" ON products
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM stores
      WHERE id = products.store_id
    )
  );

-- Prices policies
CREATE POLICY "Enable read access for all users" ON prices
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for store managers" ON prices
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM products
      JOIN stores ON stores.id = products.store_id
      WHERE products.id = prices.product_id
    )
  );

CREATE POLICY "Enable update for store managers" ON prices
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM products
      JOIN stores ON stores.id = products.store_id
      WHERE products.id = prices.product_id
    )
  );