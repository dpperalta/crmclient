import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useQuery, useMutation, gql } from '@apollo/client';

/*  CONSULTA DE PRUEBA
    const QUERY = gql`
    query obtenerProductos {
        obtenerProductos {
            id
            nombre
            precio
            existencia
        }
    }
`; */

const NUEVA_CUENTA = gql`
    mutation nuevoUsuario($input: UsuarioInput){
        nuevoUsuario(input: $input) {
            id
            nombre
            apellido
            email
        }
    }
`;

const NuevaCuenta = () => {
    /* TEST de Conexión a GRAPHQL 
    // Obtener productos desde graphql
    const { data, loading, error } = useQuery(QUERY);
    console.log(data);
    console.log(loading);
    console.log(error); */

    // State para el mensaje
    const [ mensaje, setMensaje ] = useState(null);

    // Mutation para crear un nuevo usuario
    const [ nuevoUsuario ] = useMutation(NUEVA_CUENTA);

    // Routing
    const router = useRouter();

    // Validaciones del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            password2: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                    .required('El nombre es requerido'),
            apellido: Yup.string()
                    .required('El apellido es requerido'),
            email: Yup.string()
                    .email('El email no es válido')
                    .required('El email es requerido'),
            password: Yup.string()
                    .required('La contraseña es requerido')
                    .min(6, 'La contraseña debe ser mínimo de 6 caracteres'),
            password2: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'Las contraseñas deben ser iguales')
        }),
        onSubmit: async valores => {
            //console.log(valores);
            const { nombre, apellido, email, password } = valores;
            try {
                const { data } = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password
                        }
                    }
                });

                // Usuario creado correctamente
                setMensaje(`Usuario ${ data.nuevoUsuario.nombre } ${ data.nuevoUsuario.apellido } creado satisfactoriamente`);
                setTimeout(() => {
                    setMensaje(null);
                    // Redirigir al usuario para iniciar sesión
                    router.push('/login');
                }, 3000);

            } catch (error) {
                //console.log('Error:', error);
                setMensaje(error.message.replace('GraphQL error: ', ''));
                setTimeout(() => {
                    setMensaje(null);
                }, 2000);
            }
        }
    });

    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{ mensaje }</p>
            </div>
        );
    }

    return (
        <>
            <Layout>
                { mensaje && mostrarMensaje() }
                <h1 className="text-center text-2xl text-white font-light">Crear Nueva Cuenta</h1>
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form
                            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={ formik.handleSubmit }
                        >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                </label>
                                <input 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Nombre del usuario"
                                    value={ formik.values.nombre }
                                    onChange={ formik.handleChange }
                                    onBlur={ formik.handleBlur }
                                />
                            </div>
                            {
                                formik.errors.nombre && formik.touched.nombre
                                ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error:</p>
                                        <p>{ formik.errors.nombre }</p>
                                    </div>
                                )
                                : null 
                            }
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                    Apellido
                                </label>
                                <input 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="apellido"
                                    type="text"
                                    placeholder="Apellido del usuario"
                                    value={ formik.values.apellido }
                                    onChange={ formik.handleChange }
                                />
                            </div>
                            {
                                formik.errors.apellido && formik.touched.apellido
                                ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error:</p>
                                        <p>{ formik.errors.apellido }</p>
                                    </div>
                                )
                                : null 
                            }
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    eMail
                                </label>
                                <input 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="eMail del usuario"
                                    value={ formik.values.email }
                                    onChange={ formik.handleChange }
                                />
                            </div>
                            {
                                formik.errors.email && formik.touched.email
                                ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error:</p>
                                        <p>{ formik.errors.email }</p>
                                    </div>
                                )
                                : null 
                            }
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Contraseña
                                </label>
                                <input 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="Contraseña del usuario"
                                    value={ formik.values.password }
                                    onChange={ formik.handleChange }
                                />
                            </div>
                            {
                                formik.errors.password && formik.touched.password
                                ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error:</p>
                                        <p>{ formik.errors.password }</p>
                                    </div>
                                )
                                : null 
                            }
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password2">
                                    Confirmar Contraseña
                                </label>
                                <input 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password2"
                                    type="password"
                                    placeholder="Contraseña del usuario"
                                    value={ formik.values.password2 }
                                    onChange={ formik.handleChange }
                                />
                            </div>
                            {
                                formik.errors.password2 && formik.touched.password2
                                ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error:</p>
                                        <p>{ formik.errors.password2 }</p>
                                    </div>
                                )
                                : null 
                            }
                            <input 
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor-pointer"
                                value="Crear Cuenta"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default NuevaCuenta;