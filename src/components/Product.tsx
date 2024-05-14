import React, { useEffect, useState } from 'react'
import '@/styles/product.css';
import { getProducts } from '@/services/products.service';

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);


  useEffect(() => {
    getProducts().then((res) => {
      setProducts(res.data);
    });
  }, [])
  console.log(products)
  return (
    <h1>Product</h1>
  )
}
