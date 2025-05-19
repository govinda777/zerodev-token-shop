import { render } from '@testing-library/react';
import { ProductProvider, useProducts } from './ProductProvider';

function TestComponent() {
  const { products } = useProducts();
  return <div>{products.length}</div>;
}

test('ProductProvider provides products', () => {
  const { getByText } = render(
    <ProductProvider>
      <TestComponent />
    </ProductProvider>
  );
  expect(getByText('3')).toBeInTheDocument(); // 3 mock products
}); 