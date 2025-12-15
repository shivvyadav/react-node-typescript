import { Request, Response } from 'express';
import User from '../models/user.model';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwtService';

// User Registration
export const registerUser = async (req: Request, res: Response) => {
  try {
    let { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'User already registered' });

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user._id.toString()); //generating tokens for auto login
    const refreshToken = generateRefreshToken(user._id.toString()); // after registration

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // skip password validation

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return res.status(201).json({
      message: 'User registered',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// User Login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Unauthorized access' });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken; // rotate refresh token
    await user.save({ validateBeforeSave: false });

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// User Logout
export const logoutUser = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    if (!refreshToken) return res.status(401).json({ message: 'Logged out' });

    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('LOGOUT ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const refreshUser = async (req: Request, res: Response) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken as string | undefined;
    if (!oldRefreshToken)
      return res.status(401).json({ message: 'No refresh token' });

    const decoded = verifyRefreshToken(oldRefreshToken);
    if (!decoded)
      return res.status(401).json({ message: 'Invalid refresh token' });

    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== oldRefreshToken)
      return res.status(401).json({ message: 'Refresh token revoked' });

    // rotate refresh token
    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({ message: 'Tokens refreshed' });
  } catch (error) {
    console.error('REFRESH ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
