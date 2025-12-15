import jwt, { JwtPayload } from 'jsonwebtoken';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '60m',
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d',
  });
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
};
