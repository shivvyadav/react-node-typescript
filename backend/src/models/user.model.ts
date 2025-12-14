import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { NextFunction } from 'express';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  refreshToken?: string;
  comparePassword(plainPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    refreshToken: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
UserSchema.methods.comparePassword = async function (
  plainPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
