import express from 'express'
import dotenv from 'dotenv'
import { register, login } from './auth'
import { authenticate, AuthRequest } from './middleware'
import { initDb } from './db'

dotenv.config()

initDb().catch(err => console.error('Database error:', err))

const app = express()
const PORT = Number(process.env.PORT) || 3003

app.use(express.json())

app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' })
        return
    }

    if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters' })
        return
    }

    try {
        const token = await register(email, password)
        res.status(201).json({ token })
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'User already exists') {
            res.status(409).json({ error: error.message })
            return
        }
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' })
        return
    }

    try {
        const token = await login(email, password)
        res.json({ token })
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Invalid credentials') {
            res.status(401).json({ error: error.message })
            return
        }
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.get('/api/profile', authenticate, (req: AuthRequest, res) => {
    res.json({
        userId: req.userId,
        email: req.email
    })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})