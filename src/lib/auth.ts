import { 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';
import toast from 'react-hot-toast';

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    toast.success('Signed out successfully');
  } catch (error) {
    toast.error('Failed to sign out');
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent');
  } catch (error) {
    toast.error('Failed to send password reset email');
    throw error;
  }
};

export const register = async (email: string, password: string, displayName: string) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    toast.success('Account created successfully');
    return user;
  } catch (error) {
    toast.error('Failed to create account');
    throw error;
  }
};