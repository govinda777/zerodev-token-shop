import { products } from './ProductData';

test('products array is defined and not empty', () => {
  expect(Array.isArray(products)).toBe(true);
  expect(products.length).toBeGreaterThan(0);
}); 