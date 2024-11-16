import { NextFunction, RequestHandler, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { addTokenToDB, doesUsernameExist, isPasswordValid, isTokenValid } from "./database";
import { createHash } from 'node:crypto';
import { Token } from "./types";


const publicEndpoints: string[] = ["/api/login"];

export const checkToken: any = (req: Request, res: Response, next: NextFunction): void => {
    if (publicEndpoints.includes(req.url)) return next();

    let token: string = req.cookies.token;
    if (!token) token = req.headers.token as string;
    if (!token) {
        res.status(401).send("provide a token to access this endpoint! you can aquire one at /login");
        return;
    } else {
        if (isTokenValid(token))
            next();
        else
            res.status(403).send("invalid token! you can aquire one at /login");
    }
}

export const login = (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

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
    const token: Token = createToken(username);
    res.cookie('token', token.token, { expires: token.expiration, httpOnly: false })
    res.status(200).json(token);
}

export const createUser = (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username) {
        res.status(400).send('Enter a username!')
        return
    }
    if (!password) {
        res.status(400).send('Enter a password!')
        return
    }
    if (doesUsernameExist(username)) {
        res.status(400).send('Username already in use!')
        return
    }

    createUser(username, password);

    const token: Token = createToken(username);
    res.cookie('token', token.token, { expires: token.expiration, httpOnly: false })
    res.status(200).json(token);
}

const createToken = (username: string): Token => {

    let token: Token = { token: "", expiration: new Date(), username: username }

    const md5hash = createHash('md5')
    token.token = md5hash.update(Math.random() * Number.MAX_VALUE + "").digest('hex')

    token.expiration.setMonth(token.expiration.getMonth() + 1)

    addTokenToDB(token)

    return token
}