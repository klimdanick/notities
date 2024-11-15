import { NextFunction, RequestHandler, Request, Response } from "express";
import cookieParser from "cookie-parser";


const publicEndpoints: string[] = ["/api/login"];

export const checkToken: any = (req: Request, res: Response, next: NextFunction): void => {
    if (publicEndpoints.includes(req.url)) return next();
    console.log(req.url);

    let token: string | undefined = req.cookies?.token;
    if (!token) {
        res.status(401).send("provide a token to access this endpoint! you can aquire one on /login");
        return;
    } else {
        /*

            CHECK TOKEN!

        */
        next();
    }
}