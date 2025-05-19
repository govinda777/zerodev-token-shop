export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface ProductPurchase extends Product {
  purchaseDate: Date;
  transactionHash?: string;
} 