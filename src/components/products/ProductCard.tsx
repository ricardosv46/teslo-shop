import { IProduct } from '@/interfaces'
import NextLink from 'next/link'
import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from '@mui/material'
import React, { FC, useMemo, useState } from 'react'

interface Props {
  product: IProduct
}

export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setisHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const productImage = useMemo(() => {
    return isHovered ? product.images[1] : product.images[0]
  }, [isHovered, product.images])

  return (
    <Grid
      item
      xs={6}
      sm={4}
      key={product?.slug}
      onMouseEnter={() => setisHovered(true)}
      onMouseLeave={() => setisHovered(false)}>
      <Card>
        <NextLink href={`/product/${product.slug}`} passHref legacyBehavior prefetch={false}>
          <Link>
            <CardActionArea>
              {product.inStock === 0 && (
                <Chip
                  color="primary"
                  label="No hay disponibles"
                  sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }}
                />
              )}
              <CardMedia
                className={isHovered ? 'fadeIn fadeIn-1s' : ''}
                component="img"
                image={productImage}
                alt={product?.title}
                onLoad={() => setIsImageLoaded(true)}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>
      {true && (
        <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className="fadeIn">
          <Typography fontWeight={700}>{product.title}</Typography>
          <Typography fontWeight={700}>${product.price}</Typography>
        </Box>
      )}
    </Grid>
  )
}
