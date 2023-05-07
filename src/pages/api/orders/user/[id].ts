import type { NextApiRequest, NextApiResponse } from 'next'
import { db, dbOrders } from '@database';
import { IOrder } from '@interfaces';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

type Data = 
| { message: string }
| IOrder[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    

    switch( req.method ) {
        case 'GET':
            return getOrderByUser( req, res );

        default:
            return res.status(400).json({ message: 'Bad request' })

    }
    
}

const getOrderByUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    // Vericar que tengamos un usuario
    const session: any = await getServerSession(req, res, authOptions );
    if ( !session ) {
        return res.status(401).json({message: 'Debe de estar autenticado para hacer esto'});
    }

    const { id } = req.query ;

    // Crear un arreglo con los productos que la persona quiere

    await db.connect();

    try {

        const order = await dbOrders.getOrdersByUser(id!.toString()) as IOrder[]

        if(!order) return res.status(400).json({message: 'No hay ordenes'});
        
        await db.disconnect();
        return res.status(201).json( order );
        
    } catch (error:any) {
        await db.disconnect();
        console.log(error);
        res.status(400).json({
            message: error.message || 'Revise logs del servidor'
        })
    }
    

    // return res.status(201).json( req.body );
}
