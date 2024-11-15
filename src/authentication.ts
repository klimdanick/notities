import { NextFunction, RequestHandler, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { doesUsernameExist, isPasswordValid } from "./database";
import { createHash } from 'node:crypto';


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

export const login = (req: Request, res: Response) => {
    let username = req.body.username;
    let password = req.body.password;
    if (!username) {
        res.status(400).send('Enter a username!')
        return
    }
    if (!password) {
        res.status(400).send('Enter a password!')
        return
    }
    if (!doesUsernameExist(username) || !isPasswordValid(username, password)) {
        res.status(403).send('Username or password incorrect!')
        return
    }
    let token = createToken();
    res.cookie('token', token, { maxAge: 900000000, httpOnly: false })
    res.status(200).send("succes");
}

const createToken = () => {
    const md5hash = createHash('md5')
    const token = md5hash.update(Math.random() * Number.MAX_VALUE + "").digest('hex')

    return token
}