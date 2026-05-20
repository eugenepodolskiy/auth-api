import pool from './db'
import { register, login, verifyToken } from './auth'

beforeAll(async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
    `)
    await pool.query('DELETE FROM users')
})

afterAll(async () => {
    await pool.query('DELETE FROM users')
    await pool.end()
})

describe('register', () => {

    it('should register a new user and return a token', async () => {
        const token = await register('test@test.com', 'password123')
        expect(token).toBeDefined()
        expect(typeof token).toBe('string')
    })

    it('should throw when email already exists', async () => {
        await expect(register('test@test.com', 'password123'))
            .rejects.toThrow('User already exists')
    })
})

describe('login', () => {

    it('should login and return a token', async () => {
        const token = await login('test@test.com', 'password123')
        expect(token).toBeDefined()
        expect(typeof token).toBe('string')
    })

    it('should throw with wrong password', async () => {
        await expect(login('test@test.com', 'wrongpassword'))
            .rejects.toThrow('Invalid credentials')
    })

    it('should throw with non-existent email', async () => {
        await expect(login('nobody@test.com', 'password123'))
            .rejects.toThrow('Invalid credentials')
    })
})

describe('verifyToken', () => {

    it('should return payload for valid token', async () => {
        const token = await register('verify@test.com', 'password123')
        const payload = verifyToken(token)
        expect(payload.email).toBe('verify@test.com')
        expect(payload.userId).toBeDefined()
    })

    it('should throw for invalid token', () => {
        expect(() => verifyToken('invalid-token')).toThrow()
    })
})