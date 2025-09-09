
import { useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  country: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Get additional user data from localStorage or Firestore
        const storedUserData = localStorage.getItem(`userData_${user.uid}`);
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        } else {
          setUserData({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            country: ''
          });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string, fullName: string, country: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: fullName });
      
      const newUserData: UserData = {
        uid: result.user.uid,
        email,
        displayName: fullName,
        country
      };
      
      // Store additional user data
      localStorage.setItem(`userData_${result.user.uid}`, JSON.stringify(newUserData));
      setUserData(newUserData);
      
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('rememberMe');
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    userData,
    loading,
    signup,
    login,
    logout,
    resetPassword
  };
};
