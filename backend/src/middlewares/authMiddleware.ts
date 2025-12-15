import { Request, Response, NextFunction } from 'express';
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from '../utils/jwtService';
import User from '../models/user.model';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies.accessToken as string | undefined;
    const refreshToken = req.cookies.refreshToken as string | undefined;

    // no tokens → unauthorized
    if (!accessToken && !refreshToken)
      return res.status(401).json({ message: 'Unauthorized' });

    // access token valid → allow
    const decodedAccess = accessToken ? verifyAccessToken(accessToken) : null;
    if (decodedAccess) {
      req.user = decodedAccess._id; // attach user id to request object as string
      return next();
    }

    // access token invalid → try refresh token
    if (!refreshToken)
      return res.status(401).json({ message: 'Token expired' });

    const decodedRefresh = verifyRefreshToken(refreshToken);
    if (!decodedRefresh)
      return res.status(401).json({ message: 'Invalid refresh token' });

    const user = await User.findById(decodedRefresh._id);
    if (!user || user.refreshToken !== refreshToken)
      return res.status(401).json({ message: 'Refresh token revoked' });

    // issue new access token
    const newAccessToken = generateAccessToken(user._id.toString());
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
    });

    req.user = user._id.toString(); // attach user id to request object as string
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
