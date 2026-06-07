import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

interface User {
  email: string;
  password: string;
}

// In-memory user store (replace with database in production)
const users: User[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existing = users.find((u) => u.email === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    users.push({ email: email.toLowerCase(), password: hashed });

    // Create a token for immediate login after registration (optional)
    const token = jwt.sign({ email: email.toLowerCase() }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
