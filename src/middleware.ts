import { Request, Response, NextFunction } from 'express'
import { verifyToken } from './auth'

export interface AuthRequest extends Request {
    userId?: number
    email?: string
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = verifyToken(token)
        req.userId = payload.userId
        req.email = payload.email
        next()
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' })
    }
}