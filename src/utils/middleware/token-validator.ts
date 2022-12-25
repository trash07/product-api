import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"

dotenv.config()

/**
 * Validate JWT tokens before request handling
 * @param req
 * @param res
 * @param next
 */
export function validateJwt(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.header('Authorization')
    const secret = process.env.TOKEN_SECRET as string
    if (undefined === authorizationHeader) sendAccessDeniedResponse(res)
    const jwtToken = (authorizationHeader as string)
        .replace('Bearer', '')
        .trim()
    try {
        jwt.verify(jwtToken, secret)
        next()
    } catch (err) {
        sendAccessDeniedResponse(res)
    }
}

/**
 * Send access denied response
 * @param res
 */
function sendAccessDeniedResponse(res: Response) {
    res.status(401)
        .json('Access denied, invalid token').end()
}
