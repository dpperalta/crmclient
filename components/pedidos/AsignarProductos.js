import React, { useEffect, useState, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

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

const AsignarProductos = () => {

    // State local del componente
    const [ productos, setProductos ] = useState([]);

    // Hacer uso del context
    const pedidoContext = useContext( PedidoContext );
    const { agregarProducto } = pedidoContext;

    // Consulta de productos en la Base de Datos
    const { data, loading, error } = useQuery( OBTENER_PRODUCTOS );

    useEffect(() => {
        // Función para pasar al state
        agregarProducto( productos );
    }, [ productos ]);

    if(loading) return null;

    const { obtenerProductos } = data;

    const seleccionarProducto = producto => {
        setProductos(producto);
    }

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2. Busca o selecciona los productos</p>
            <Select
                className="mt-3"
                options={ obtenerProductos }
                onChange={ opcion => seleccionarProducto(opcion) }
                isMulti={ true }
                getOptionValue={ opciones => opciones.id }
                getOptionLabel={ opciones => `${ opciones.nombre } - ${ opciones.existencia } Disponibles` }
                placeholder="Busque o Seleccione un producto"
                noOptionsMessage={ () => "No hay resultados" }
            />
        </>
    );
}

export default AsignarProductos;