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

/**
 * FUnción para mostrar un alert si el usuario es nuevo y permitir  enviar enlace por correo para recuperar contraseña.   
 * @param {*} user 
 * @param {*} setIsNew 
 * @param {*} logout 
 * @param {*} navigate 
 */
export const showNewUserAlert = async (user, setIsNew = null, logout, navigate) => {
    if (user.state === 'I' || user.state.toLowerCase() === 'initial') {
        if (setIsNew) setIsNew(true);
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

/**
 * Función para manejar el restablecimiento de contraseña.
 * Muestra un alert, envía el correo y redirige al usuario a la página de login.
 * @param {*} user 
 * @param {*} setIsNew 
 * @param {*} logout 
 * @param {*} navigate 
 * @returns 
 */
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

/**
 * Funcion para alerta cuando un cliente no tiene tienda asociada
 */
export const userNotStore = async (user, logout, navigate) => {
    const role = user?.role?.toLowerCase();
    const noStore = !user?.store || !user?.store?.id;

    if ((role === 'vendedor' || role === 'store admin') && noStore) {
        MySwal.fire({
            icon: 'warning',
            title: '!Falta un paso!',
            text: 'Aún no tiene una tienda asignada. Contacte a su proveedor.',
            confirmButtonText: 'Cerrar',
            allowOutsideClick: false,
        });
        await logout();
        navigate('/login');
    }
}