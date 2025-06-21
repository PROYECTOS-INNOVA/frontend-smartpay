import { jwtDecode } from 'jwt-decode'; 
export const getUserRoleFromToken = () => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken.role.name;
        }
    } catch (error) {
        console.error("Error decoding token or getting role:", error);
    }
    return null;
};