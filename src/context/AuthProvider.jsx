import { useState, useContext, useEffect } from 'react';
import { AuthContext, dummyUsers } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('currentUser');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [user]);

    const login = (username) => {
        const foundUser = dummyUsers[username];
        if (foundUser) {
            setUser(foundUser);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const testChangeRole = (role) => {
        if (dummyUsers[role.toLowerCase()]) {
            setUser(dummyUsers[role.toLowerCase()]);
        } else {
            console.warn(`Rol '${role}' no encontrado en los usuarios dummy.`);
        }
    };

    const value = { user, login, logout, testChangeRole };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};