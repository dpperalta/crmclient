import { React, useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from "next/router";

const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput){
        nuevoCliente(input: $input) {
            id
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`;

const OBTENER_CLIENTES_USUARIOS = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;

const NuevoCliente = () => {

    // Enrutar cliente
    const router = useRouter();

    // State para mostrar mensajes
    const [ mensaje, setMensaje ] = useState(null);

    // Mutation para crear nuevos clientes
    const [ nuevoCliente ] = useMutation(NUEVO_CLIENTE, {
        update(cache, { data: { nuevoCliente } }) {
            // Obtener el objeto de caché a actualizar
            const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIOS });
            // Re-escribir el caché (el caché nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIOS,
                data: {
                    obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            empresa: '',
            email: '',
            telefono: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                        .required('El nombre del cliente es requerido'),
            apellido: Yup.string()
                        .required('El apellido del cliente es requerido'),
            empresa: Yup.string()
                        .required('La empresa del cliente es requerida'),
            email: Yup.string()
                        .email('eMail no válido')
                        .required('El eMail del cliente es requerido')
        }),
        onSubmit: async valores => {
            const { nombre, apellido, empresa, email, telefono } = valores;
            try {
                const { data } = await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono
                        }
                    }
                });
                router.push('/');
            } catch (error) {
                //console.log(error);
                setMensaje(error.message.replace('GraphQL error: ', ''));
                setTimeout(() => {
                    setMensaje(null);
                }, 2000);
            }
        }
    });

    const mostrarMensaje = () => {
        return (
            <div className="bg-red-200 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{ mensaje }</p>
            </div>
        )
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>
            {
                mensaje && mostrarMensaje()
            }
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form 
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
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
                                placeholder="Nombre del cliente"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.nombre }
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
                                placeholder="Apellido del cliente"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.apellido }
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
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                                Empresa
                            </label>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="empresa"
                                type="text"
                                placeholder="Empresa del cliente"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.empresa }
                            />
                        </div>
                        {
                            formik.errors.empresa && formik.touched.empresa
                            ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error:</p>
                                    <p>{ formik.errors.empresa }</p>
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
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.email }
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
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                Teléfono
                            </label>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="telefono"
                                type="tel"
                                placeholder="Teléfono del cliente"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.telefono }
                            />
                        </div>
                        <input 
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-blue-900 cursor-pointer"
                            value="Registrar Cliente"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoCliente;