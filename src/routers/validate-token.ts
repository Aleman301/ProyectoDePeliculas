import { Request, Response, NextFunction } from "express";
import  jwt, { JwtPayload }  from "jsonwebtoken";
import 'dotenv/config';

export let decodeToken: InterfaceJWTPayload;

interface InterfaceJWTPayload {
    accountName: string,
    rol: string,
    iat: number,
    exp: number
}

const validateToken = (req: Request, res: Response, next: NextFunction) => {

    const headerToken = req.headers['authorization'];

    if(headerToken != undefined || headerToken.startsWith('Bearer')){
        //Tiene token
        try {
            
            const match = (headerToken.match(/(Bearer )?/) && headerToken.match(/(Bearer)?/)[1] !== undefined) ? true : false;
            const bearerToken = (match) ? headerToken.slice(7) : headerToken;

            const infoToken = jwt.verify(bearerToken, process.env.SECRET_KEY || 'Erlin99');

            decodeToken = infoToken as InterfaceJWTPayload;

            next();

        } catch (error) {
            res.status(401).json({
                msg: error.message
            })
        }
    }else{
        res.status(401).json({
            msg: 'Acceso Denegado'
        })
    }
    
}


export default validateToken;