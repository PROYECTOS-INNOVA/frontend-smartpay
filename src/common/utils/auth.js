import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { requestPasswordReset } from '../../api/auth';
const MySwal = withReactContent(Swal);


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

export const showNewUserAlert = async (user, setIsNew, logout,  navigate) => {
    if (user.state === 'I' || user.state.toLowerCase() === 'initial') {
        setIsNew(true);
        const result = await MySwal.fire({
            icon: 'warning',
            title: '¡Cambia tu contraseña!',
            text: 'Se enviará un enlace a tu correo para que puedas realizar el cambio.',
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            backdrop: true,
            confirmButtonText: 'Enviar enlace',
        });

        if (result.isConfirmed) {
            await handlePasswordReset(user, setIsNew, logout, navigate);
        }
    }
};

export const handlePasswordReset = async (user, setIsNew, logout, navigate) => {
    if (!user?.dni) return;

    MySwal.fire({
        title: 'Procesando...',
        text: 'Enviando el correo para restablecer la contraseña.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        didOpen: () => MySwal.showLoading(),
    });

    try {
        await requestPasswordReset({ dni: user.dni });

        const result = await MySwal.fire({
            icon: 'success',
            title: '¡Correo enviado!',
            text: 'Vuelve a iniciar sesión cuando cambies tu contraseña.',
            confirmButtonText: 'Ya cambié mi contraseña.',
            allowOutsideClick: false,
        });

        if (result.isConfirmed) {
            await logout();
            navigate('/login');
            setIsNew(false);
        }
    } catch (error) {
        await MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo enviar el correo. Intenta de nuevo más tarde.',
            confirmButtonText: 'Entendido',
        });
    }
};
