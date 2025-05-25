import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/product';
import React from 'react';

// Mock do Next.js Image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

const mockProduct: Product = {
  id: '1',
  name: 'Produto Teste',
  description: 'Descrição do produto teste',
  price: 100,
  image: '/test-image.jpg',
  type: 'product',
  installments: true,
  requiredStake: 50
};

const mockProductWithoutInstallments: Product = {
  id: '2',
  name: 'Produto Simples',
  description: 'Produto sem parcelamento',
  price: 50,
  image: '/simple-product.jpg',
  type: 'service',
  installments: false
};

describe('ProductCard', () => {
  const mockOnBuy = jest.fn();
  const mockOnBuyInstallment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar informações básicas do produto', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onBuy={mockOnBuy} 
      />
    );

    expect(screen.getByText('Produto Teste')).toBeInTheDocument();
    expect(screen.getByText('Descrição do produto teste')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Tokens')).toBeInTheDocument();
  });

  it('deve renderizar imagem do produto', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onBuy={mockOnBuy} 
      />
    );

    const image = screen.getByAltText('Produto Teste');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('deve mostrar badge "Parcelável" quando produto tem installments', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onBuy={mockOnBuy} 
      />
    );

    expect(screen.getByText('Parcelável')).toBeInTheDocument();
  });

  it('não deve mostrar badge "Parcelável" quando produto não tem installments', () => {
    render(
      <ProductCard 
        product={mockProductWithoutInstallments} 
        onBuy={mockOnBuy} 
      />
    );

    expect(screen.queryByText('Parcelável')).not.toBeInTheDocument();
  });

  it('deve mostrar "Token" no singular quando preço é 1', () => {
    const singleTokenProduct = { ...mockProduct, price: 1 };
    render(
      <ProductCard 
        product={singleTokenProduct} 
        onBuy={mockOnBuy} 
      />
    );

    expect(screen.getByText('Token')).toBeInTheDocument();
    expect(screen.queryByText('Tokens')).not.toBeInTheDocument();
  });

  it('deve chamar onBuy quando botão "Comprar Agora" é clicado', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onBuy={mockOnBuy} 
      />
    );

    const buyButton = screen.getByRole('button', { name: /comprar produto teste/i });
    fireEvent.click(buyButton);

    expect(mockOnBuy).toHaveBeenCalledWith(mockProduct);
  });

  it('deve mostrar "Saldo Insuficiente" quando disabled é true', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onBuy={mockOnBuy} 
        disabled={true}
      />
    );

    expect(screen.getByText('Saldo Insuficiente')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /comprar produto teste/i })).toBeDisabled();
  });

  it('deve mostrar informação de stake requerido', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onBuy={mockOnBuy} 
      />
    );

    expect(screen.getByText('Requer 50 tokens em stake')).toBeInTheDocument();
  });

  it('não deve mostrar informação de stake quando não requerido', () => {
    const productWithoutStake = { ...mockProduct, requiredStake: undefined };
    render(
      <ProductCard 
        product={productWithoutStake} 
        onBuy={mockOnBuy} 
      />
    );

    expect(screen.queryByText(/requer.*tokens em stake/i)).not.toBeInTheDocument();
  });

  describe('Funcionalidade de Parcelamento', () => {
    it('deve mostrar botão de parcelamento quando produto tem installments e hasStakeForInstallments é true', () => {
      render(
        <ProductCard 
          product={mockProduct} 
          onBuy={mockOnBuy} 
          onBuyInstallment={mockOnBuyInstallment}
          hasStakeForInstallments={true}
        />
      );

      expect(screen.getByRole('button', { name: /opções de parcelamento/i })).toBeInTheDocument();
    });

    it('não deve mostrar botão de parcelamento quando hasStakeForInstallments é false', () => {
      render(
        <ProductCard 
          product={mockProduct} 
          onBuy={mockOnBuy} 
          onBuyInstallment={mockOnBuyInstallment}
          hasStakeForInstallments={false}
        />
      );

      expect(screen.queryByRole('button', { name: /opções de parcelamento/i })).not.toBeInTheDocument();
    });

    it('deve mostrar opções de parcelamento quando botão é clicado', () => {
      render(
        <ProductCard 
          product={mockProduct} 
          onBuy={mockOnBuy} 
          onBuyInstallment={mockOnBuyInstallment}
          hasStakeForInstallments={true}
        />
      );

      const installmentButton = screen.getByRole('button', { name: /opções de parcelamento/i });
      fireEvent.click(installmentButton);

      expect(screen.getByText('Escolha o parcelamento:')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2x de 50.0 tokens')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirmar parcelamento/i })).toBeInTheDocument();
    });

    it('deve permitir selecionar diferentes opções de parcelamento', () => {
      render(
        <ProductCard 
          product={mockProduct} 
          onBuy={mockOnBuy} 
          onBuyInstallment={mockOnBuyInstallment}
          hasStakeForInstallments={true}
        />
      );

      // Abrir opções de parcelamento
      const installmentButton = screen.getByRole('button', { name: /opções de parcelamento/i });
      fireEvent.click(installmentButton);

      // Selecionar 4x
      const select = screen.getByDisplayValue('2x de 50.0 tokens');
      fireEvent.change(select, { target: { value: '4' } });

      expect(screen.getByDisplayValue('4x de 25.0 tokens')).toBeInTheDocument();
    });

    it('deve chamar onBuyInstallment quando confirmar parcelamento', () => {
      render(
        <ProductCard 
          product={mockProduct} 
          onBuy={mockOnBuy} 
          onBuyInstallment={mockOnBuyInstallment}
          hasStakeForInstallments={true}
        />
      );

      // Abrir opções de parcelamento
      const installmentButton = screen.getByRole('button', { name: /opções de parcelamento/i });
      fireEvent.click(installmentButton);

      // Confirmar parcelamento
      const confirmButton = screen.getByRole('button', { name: /confirmar parcelamento/i });
      fireEvent.click(confirmButton);

      expect(mockOnBuyInstallment).toHaveBeenCalledWith(mockProduct, 2);
    });

    it('deve fechar opções de parcelamento quando cancelar', () => {
      render(
        <ProductCard 
          product={mockProduct} 
          onBuy={mockOnBuy} 
          onBuyInstallment={mockOnBuyInstallment}
          hasStakeForInstallments={true}
        />
      );

      // Abrir opções de parcelamento
      const installmentButton = screen.getByRole('button', { name: /opções de parcelamento/i });
      fireEvent.click(installmentButton);

      // Cancelar
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Escolha o parcelamento:')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /opções de parcelamento/i })).toBeInTheDocument();
    });

    it('deve fechar opções de parcelamento após confirmar', () => {
      render(
        <ProductCard 
          product={mockProduct} 
          onBuy={mockOnBuy} 
          onBuyInstallment={mockOnBuyInstallment}
          hasStakeForInstallments={true}
        />
      );

      // Abrir opções de parcelamento
      const installmentButton = screen.getByRole('button', { name: /opções de parcelamento/i });
      fireEvent.click(installmentButton);

      // Confirmar parcelamento
      const confirmButton = screen.getByRole('button', { name: /confirmar parcelamento/i });
      fireEvent.click(confirmButton);

      expect(screen.queryByText('Escolha o parcelamento:')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /opções de parcelamento/i })).toBeInTheDocument();
    });
  });
}); 