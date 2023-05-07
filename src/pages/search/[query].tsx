import type { NextPage, GetServerSideProps } from 'next'
import { Typography, Box } from '@mui/material'

import { ShopLayout } from '@components/layout'
import useSWR from 'swr'
import { ProductList } from '@components/products'

import { dbProducts } from '@database'
import { IProduct } from '@interfaces'
import { useRouter } from 'next/router'

interface IProps {
  products: IProduct[]
  foundProducts: boolean
  query: string
}

const SearchPage: NextPage = () => {
  const router = useRouter()
  const { query: slug } = router.query
  const { data, isLoading } = useSWR<IProps>(`/api/search/${slug}`)

  return (
    <ShopLayout
      title={'Teslo-Shop - Search'}
      pageDescription={'Encuentra los mejores productos de Teslo aquí'}>
      <Typography variant="h1" component="h1">
        Buscar productos
      </Typography>

      {data?.foundProducts ? (
        <Typography variant="h2" sx={{ mb: 1 }} textTransform="capitalize">
          Término: {data?.query}
        </Typography>
      ) : (
        <Box display="flex">
          <Typography variant="h2" sx={{ mb: 1 }}>
            No encontramos ningún produto
          </Typography>
          <Typography variant="h2" sx={{ ml: 1 }} color="secondary" textTransform="capitalize">
            {data?.query}
          </Typography>
        </Box>
      )}

      <ProductList products={data?.products!} />
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export default SearchPage
