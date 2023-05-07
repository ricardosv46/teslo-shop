import { db, dbProducts } from '@database';
import { IProduct } from '@interfaces';
import { Product } from '@models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = 
| { message: string }
|{products: IProduct[],foundProducts:boolean,query:string};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {

        case 'GET':
            return searchProducts( req, res )

        default:
            return res.status(400).json({
                message: 'Bad request'
            });
    }

}

const searchProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    let { q = '' } = req.query;

    await db.connect();
    let products = await dbProducts.getProductsByTerm(q!.toString())
    const foundProducts = products.length > 0

    if( !products ) {
        return res.status(404).json({
            message: 'Producto no encontrado'
        })
    }

  if (!foundProducts) {
    // products = await dbProducts.getAllProducts();
    products = await dbProducts.getProductsByTerm('shirt')
  }

  await db.disconnect();


  return res.json( { products, foundProducts, query:q?.toString() || '' } );

}
