import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!) {
        obtenerProducto(id: $id) {
            nombre
            precio
            existencia
        }
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input) {
            id
            nombre
            existencia
            precio
        }
    }
`;

const EditarProducto = () => {

    // Enrutador
    const router = useRouter();

    // State para mostrar mensajes de error
    const [ mensaje, setMensaje ] = useState(null);

    const { query: { id } } = router;

    // Consultar BD para extraer el producto
    const { data, loading, error } = useQuery( OBTENER_PRODUCTO, {
        variables: {
            id
        }
    } );

    // Mutation para actualizar producto
    const [ actualizarProducto ] = useMutation( ACTUALIZAR_PRODUCTO );

    // Schema de Validación
    const schemaValidation = Yup.object({
        nombre: Yup.string()
                    .required('El nombre del producto es requerido'),
        existencia: Yup.number()
                    .required('Ingrese la cantidad disponible')
                    .positive('No se permite el ingreso de números negativos')
                    .integer('El número ingresado no es un número entero'),
        precio: Yup.number()
                    .required('El precio del producto es requerido')
                    .positive('No se permite el ingreso de números negativos')
    });

    if(loading) return <p>Cargando...</p>

    if(!data) {
        return <p>Acción no permitida</p>
    }
    
    const actualizarDataProducto = async valores => {
        //console.log(valores);
        const { nombre, existencia, precio } = valores;
        try {
            const { data } = await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre,
                        existencia,
                        precio
                    }
                }
            });
            // Redirigir a la página de productos
            router.push('/productos');
            // Mostrar Alerta
            Swal.fire('¡Correcto!', 'Producto actualizado satisfactoriamente', 'success');
        } catch (error) {
            //console.log(error);
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
    
    const { obtenerProducto } = data;

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>

            {
                mensaje && mostrarMensaje()
            }

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        enableReinitialize
                        initialValues= { obtenerProducto }
                        validationSchema={ schemaValidation }
                        onSubmit={ valores => {
                            actualizarDataProducto(valores);
                        } }
                    >
                        {
                            props => {
                                return (
                                    <form 
                                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                        onSubmit={ props.handleSubmit }
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
                                            <label className="block text-gray-700 text-sm font-bold mb-s" htmlFor="existencia">
                                                Existencia (unidades)
                                            </label>
                                            <input 
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="existencia"
                                                type="number"
                                                placeholder="Unidades en existencia"
                                                onChange={ props.handleChange }
                                                onBlur={ props.handleBlur }
                                                value={ props.values.existencia }
                                            />
                                        </div>
                                        {
                                            props.errors.existencia && props.touched.existencia
                                            ? (
                                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                    <p className="font-bold">Error:</p>
                                                    <p>{ props.errors.existencia }</p>
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
                                                onChange={ props.handleChange }
                                                onBlur={ props.handleBlur }
                                                value={ props.values.precio }
                                            />
                                        </div>
                                        {
                                            props.errors.precio && props.touched.precio
                                            ? (
                                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                    <p className="font-bold">Error:</p>
                                                    <p>{ props.errors.precio }</p>
                                                </div>
                                            )
                                            : null 
                                        }
                                        <input 
                                            type="submit"
                                            className="bg-gray-800 w-full mt-5 p-2 text-white font-bold hover:bg-blue-900 cursor-pointer"
                                            value="Editar Producto"
                                        />
                                    </form>
                                )
                            }
                        }
                    </Formik>
                </div>
            </div>

        </Layout>
    );
}

export default EditarProducto;