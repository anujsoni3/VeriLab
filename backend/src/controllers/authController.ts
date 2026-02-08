import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWTPayload } from '../types/index.js';

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, displayName, username, college, branch } = req.body;

        // Validation
        if (!email || !password || !displayName || !username || !college || !branch) {
            res.status(400).json({ success: false, error: 'All fields are required' });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ success: false, error: 'Invalid email format' });
            return;
        }

        // Password validation
        if (password.length < 8) {
            res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
            return;
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, error: 'User already exists' });
            return;
        }

        // Check if username is taken
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            res.status(400).json({ success: false, error: 'Username already taken' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            displayName,
            username,
            college,
            branch,
            avatar: null,
            solvedProblems: [],
            totalPoints: 0,
            rank: 0,
        });

        // Generate JWT
        const token = jwt.sign(
            { uid: user._id.toString(), email } as JWTPayload,
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    uid: user._id.toString(),
                    email: user.email,
                    displayName: user.displayName,
                    username: user.username,
                    college: user.college,
                    branch: user.branch,
                    avatar: user.avatar,
                    solvedProblems: user.solvedProblems,
                    totalPoints: user.totalPoints,
                    rank: user.rank,
                },
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, error: 'Email and password are required' });
            return;
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }

        // Generate JWT
        const token = jwt.sign(
            { uid: user._id.toString(), email } as JWTPayload,
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    uid: user._id.toString(),
                    email: user.email,
                    displayName: user.displayName,
                    username: user.username,
                    college: user.college,
                    branch: user.branch,
                    avatar: user.avatar,
                    solvedProblems: user.solvedProblems,
                    totalPoints: user.totalPoints,
                    rank: user.rank,
                    createdAt: user.createdAt,
                },
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, error: 'Not authenticated' });
            return;
        }

        const user = await User.findById(req.user.uid).select('-password');
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        res.json({
            success: true,
            data: {
                uid: user._id.toString(),
                email: user.email,
                displayName: user.displayName,
                username: user.username,
                college: user.college,
                branch: user.branch,
                avatar: user.avatar,
                solvedProblems: user.solvedProblems,
                totalPoints: user.totalPoints,
                rank: user.rank,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
