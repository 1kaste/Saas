import React from 'react';

export interface Product {
  id: number; // Changed from string to number for DB primary key
  title: string;
  price: number; // Price in cents
  description: string;
  imageUrl: string;
}

export interface ShopData {
  name: string;
  description:string;
  logoUrl: string;
}

export interface Category {
  name: string;
  icon: React.ReactNode;
}