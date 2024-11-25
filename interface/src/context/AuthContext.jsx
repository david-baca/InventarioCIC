import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../services/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';


const authContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    console.log('Error creating auth context');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscribed = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => subscribed();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    setUser(credential.user);
    return credential;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <authContext.Provider
      value={{
        loginWithGoogle,
        logout,
        user,
      }}
    >
      {children}
    </authContext.Provider>
  );
}