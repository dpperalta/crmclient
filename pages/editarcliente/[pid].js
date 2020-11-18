import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_CLIENTE = gql`
    query obtenerCliente($id: ID!) {
        obtenerCliente(id: $id) {
            id
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`;

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput) {
        actualizarCliente(id: $id, input: $input) {
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`;

const EditarCliente = () => {

    // Obtener el ID enviado desde el formulario de clientes
    const router = useRouter();
    // State para mostrar mensajes
    const [ mensaje, setMensaje ] = useState(null);

    const { query: { id } } = router;

    // Consultar el cliente desde la BD
    const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });

    // Actualizar cliente
    const [ actualizarCliente ] = useMutation( ACTUALIZAR_CLIENTE );

    // Schema de validación del formulario con formik
    const schemaValidation = Yup.object({
        nombre: Yup.string()
                    .required('El nombre del cliente es requerido'),
        apellido: Yup.string()
                    .required('El apellido del cliente es requerido'),
        empresa: Yup.string()
                    .required('La empresa del cliente es requerida'),
        email: Yup.string()
                    .email('eMail no válido')
                    .required('El eMail del cliente es requerido')
    });
    
    if(loading) return <p>Cargando...</p>;

    const { obtenerCliente } = data;

    // Modificar el cliente en la BD
    const actualizarDatosCliente = async( valores ) => {
        const { nombre, apellido, empresa, email, telefono } = valores;
        try {
            const { data } = await actualizarCliente({
                variables: {
                    id,
                    input: {
                        nombre,
                        apellido,
                        empresa,
                        email,
                        telefono
                    }
                }
            });
            // Mostrar mensaje SWAL de actualización
            Swal.fire('Actualizado', 'Cliente actualizado satisfactoriamente', 'success');
            // Redireccionar a página de clientes
            router.push('/');
        } catch (error) {
            setMensaje(error.message.replace('GraphQL error: ', ''));
            setTimeout(() => {
                setMensaje(null);
            }, 2000);
        }
    }

    const mostrarMensaje = () => {
        return (
            <div className="bg-red-200 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{ mensaje }</p>
            </div>
        )
    }

    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light"> Editar Cliente </h1>

            {
                mensaje && mostrarMensaje()
            }

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={ schemaValidation }
                        enableReinitialize
                        initialValues={ obtenerCliente }
                        onSubmit= { ( valores ) => {
                            actualizarDatosCliente(valores);
                        }}
                    >
                        { props => {
                            //console.log(props);
                            return (
                                <form 
                                    className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                    onSubmit={ props.handleSubmit }
                                >
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                            Nombre
                                        </label>
                                        <input 
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="nombre"
                                            type="text"
                                            placeholder="Nombre del cliente"
                                            onChange={ props.handleChange }
                                            onBlur={ props.handleBlur }
                                            value={ props.values.nombre }
                                        />
                                    </div>
                                        {
                                            props.errors.nombre && props.touched.nombre
                                            ? (
                                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                    <p className="font-bold">Error:</p>
                                                    <p>{ props.errors.nombre }</p>
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
                                            placeholder="Apellido del cliente"
                                            onChange={ props.handleChange }
                                            onBlur={ props.handleBlur }
                                            value={ props.values.apellido }
                                        />
                                    </div>
                                        {
                                            props.errors.apellido && props.touched.apellido
                                            ? (
                                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                    <p className="font-bold">Error:</p>
                                                    <p>{ props.errors.apellido }</p>
                                                </div>
                                            )
                                            : null 
                                        }
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                                            Empresa
                                        </label>
                                        <input 
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="empresa"
                                            type="text"
                                            placeholder="Empresa del cliente"
                                            onChange={ props.handleChange }
                                            onBlur={ props.handleBlur }
                                            value={ props.values.empresa }
                                        />
                                    </div>
                                        {
                                            props.errors.empresa && props.touched.empresa
                                            ? (
                                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                    <p className="font-bold">Error:</p>
                                                    <p>{ props.errors.empresa }</p>
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
                                            placeholder="eMail del cliente"
                                            onChange={ props.handleChange }
                                            onBlur={ props.handleBlur }
                                            value={ props.values.email }
                                        />
                                    </div>
                                        {
                                            props.errors.email && props.touched.email
                                            ? (
                                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                    <p className="font-bold">Error:</p>
                                                    <p>{ props.errors.email }</p>
                                                </div>
                                            )
                                            : null 
                                        }
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                            Teléfono
                                        </label>
                                        <input 
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="telefono"
                                            type="tel"
                                            placeholder="Teléfono del cliente"
                                            onChange={ props.handleChange }
                                            onBlur={ props.handleBlur }
                                            value={ props.values.telefono }
                                        />
                                    </div>
                                    <input 
                                        type="submit"
                                        className="bg-gray-800 w-full mt-5 p-2 text-white font-bold hover:bg-blue-900 cursor-pointer"
                                        value="Editar Cliente"
                                    />
                                </form>
                            )
                        }}
                    </Formik>
                </div>
            </div>

        </Layout>
    );
}

export default EditarCliente;