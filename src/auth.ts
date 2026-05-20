import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from './db'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string
const SALT_ROUNDS = 10

interface User {
    id: number
    email: string
    password: string
    created_at: Date
}

interface TokenPayload {
    userId: number
    email: string
}

export async function register(email: string, password: string): Promise<string> {
    const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
    )

    if (existing.rows.length > 0) {
        throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const result = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [email, hashedPassword]
    )

    const user: User = result.rows[0]
    return generateToken(user)
}

export async function login(email: string, password: string): Promise<string> {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    )

    if (result.rows.length === 0) {
        throw new Error('Invalid credentials')
    }

    const user: User = result.rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        throw new Error('Invalid credentials')
    }

    return generateToken(user)
}

export function verifyToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
}

function generateToken(user: User): string {
    const payload: TokenPayload = {
        userId: user.id,
        email: user.email
    }
    const secret: jwt.Secret = JWT_SECRET
    const options: jwt.SignOptions = { expiresIn: 60 * 60 * 24 }
    return jwt.sign(payload, secret, options) as string
}