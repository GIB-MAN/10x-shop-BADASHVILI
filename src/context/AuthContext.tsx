/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type AuthContextValue = {
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [username, setUsername] = useState<string | null>(null);

  const login = (value: string) => {
    setUsername(value);
  };

  const logout = () => {
    setUsername(null);
  };

  const value: AuthContextValue = {
    username,
    isAuthenticated: username !== null,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
