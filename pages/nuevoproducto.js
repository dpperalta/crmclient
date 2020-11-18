import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from "next/router";
import Swal from 'sweetalert2';

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input) {
            id
            nombre
            existencia
            precio
        }
    }
`;

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos {
            id
            nombre
            precio
            existencia
        }
    }
`;

const NuevoProducto = () => {

    // Definicion del state del ruteo
    const router = useRouter();

    // State para mostrar mensajes
    const [ mensaje, setMensaje ] = useState(null);

    // Mutation para crear producto
    const[ nuevoProducto ] = useMutation( NUEVO_PRODUCTO, {
        update( cache, { data: { nuevoProducto } } ) {
            // Obtener el objeto de la caché
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });
            // Re-escribir el objeto de caché
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [ ...obtenerProductos, nuevoProducto ]
                }
            })
        }
    } );

    // Formulario para nuevos productos
    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                        .required('El nombre del producto es requerido'),
            existencia: Yup.number()
                        .required('Ingrese la cantidad disponible')
                        .positive('No se permite el ingreso de números negativos')
                        .integer('El número ingresado no es un número entero'),
            precio: Yup.number()
                        .required('El precio del producto es requerido')
                        .positive('No se permite el ingreso de números negativos')
        }),
        onSubmit: async valores => {
            //console.log(valores);
            const { nombre, existencia, precio } = valores;
            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            existencia,
                            precio
                        }
                    }
                });

                // Redireccionar hacia productos
                router.push('/productos');
                // Mostrar alertar
                Swal.fire('¡Creado!', 'Producto creado satisfactoriamente', 'success');
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
            <h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Producto</h1>

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
                            <label className="block text-gray-700 text-sm font-bold mb-s" htmlFor="nombre">
                                Nombre
                            </label>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nombre"
                                type="text"
                                placeholder="Nombre del producto"
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
                            <label className="block text-gray-700 text-sm font-bold mb-s" htmlFor="existencia">
                                Existencia (unidades)
                            </label>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="existencia"
                                type="number"
                                placeholder="Unidades en existencia"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.existencia }
                            />
                        </div>
                        {
                            formik.errors.existencia && formik.touched.existencia
                            ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error:</p>
                                    <p>{ formik.errors.existencia }</p>
                                </div>
                            )
                            : null 
                        }
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-s" htmlFor="precio">
                                Precio ($)
                            </label>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="precio"
                                type="number"
                                placeholder="Precio del producto"
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                value={ formik.values.precio }
                            />
                        </div>
                        {
                            formik.errors.precio && formik.touched.precio
                            ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error:</p>
                                    <p>{ formik.errors.precio }</p>
                                </div>
                            )
                            : null 
                        }
                        <input 
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white font-bold hover:bg-blue-900 cursor-pointer"
                            value="Registrar Nuevo Producto"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default NuevoProducto;