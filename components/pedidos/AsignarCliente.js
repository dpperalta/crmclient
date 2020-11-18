import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

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

const AsignarCliente = () => {

    // State para el select
    const [ cliente, setCliente ] = useState([]);

    // Context de Pedidos
    const pedidoContext = useContext( PedidoContext );
    const { agregarCliente } = pedidoContext;

    // Consultar clientes de la base de datos
    const { data, loading, error } = useQuery( OBTENER_CLIENTES_USUARIOS );

    useEffect(() => {
        agregarCliente(cliente);
    }, [ cliente ]);

    const seleccionarCliente = clientes => {
        setCliente(clientes);
    }

    // Resultados de la consutl
    if(loading) return null;
    const { obtenerClientesVendedor } = data;

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1. Asignar un cliente al pedido</p>
            <Select
                className="mt-3"
                options={ obtenerClientesVendedor }
                onChange={ opcion => seleccionarCliente(opcion) }
                getOptionValue={ opciones => opciones.id }
                getOptionLabel={ opciones => `${ opciones.nombre } ${ opciones.apellido }` }
                placeholder="Busque o Seleccione un cliente"
                noOptionsMessage={ () => "No hay resultados" }
            />
        </>
    );
}

export default AsignarCliente;