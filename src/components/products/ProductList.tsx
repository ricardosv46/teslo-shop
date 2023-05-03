import { IProduct } from '@/interfaces'
import { Grid } from '@mui/material'
import React, { FC } from 'react'
import { ProductCard } from './ProductCard'

interface Props {
  products: IProduct[]
}

export const ProductList: FC<Props> = ({ products }) => {
  return (
    <Grid container spacing={4}>
      {products?.map((product) => (
        <ProductCard product={product} key={product.slug} />
      ))}
    </Grid>
  )
}
