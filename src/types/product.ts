
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: 'service' | 'product';
  installments?: boolean;
  requiredStake?: number;
}

export interface Purchase {
  productId: string;
  timestamp: number;
  price: number;
  installments?: number;
}
