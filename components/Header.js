import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const OBTENER_USUARIO = gql`
    query obtenerUsuario {
        obtenerUsuario {
            id
            nombre
            apellido
        }
    }
`;

const Header = () => {
    const router = useRouter();
    // Consulta para obtener datos del usuario
    const { data, loading, error } = useQuery(OBTENER_USUARIO);
    if(loading) return 'Cargando...';
    // Si no hay información redireccionar al login
    if(!data) {
        router.push('/login');
        return <p>Cargando...</p>;
    }
    // Proteger que no se intente acceder a los datos antes de obtener resultados
    const { nombre, apellido } = data.obtenerUsuario;

    // Cerrar sesión
    const cerrarSesion = () => {
        localStorage.removeItem('token');
        location.reload();
        router.push('/login');
    }

    return (
        <div className="sm:flex sm:justify-between mb-6">
            <p className="mr-2 mb-5 lg:mb-0">Usuario: { nombre } { apellido }</p>
            <button 
                onClick={ ()=> cerrarSesion() }
                type="button"
                className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md hover:bg-blue-900"
            >
                Cerrar Sesión
            </button>
        </div>
    );
}

export default Header;