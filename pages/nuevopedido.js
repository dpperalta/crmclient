import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import AsignarCliente from '../components/pedidos/AsignarCliente';
import AsignarProductos from '../components/pedidos/AsignarProductos';
import ResumenPedido from '../components/pedidos/ResumenPedido';
import Total from '../components/pedidos/Total';

import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

// Context de Pedidos
import PedidoContext from '../context/pedidos/PedidoContext';

const NUEVO_PEDIDO = gql`
    mutation nuevoPedido($input: PedidoInput) {
        nuevoPedido(input: $input) {
            id
            vendedor
        }
    }
`;

const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor {
        obtenerPedidosVendedor {
            id
            pedido {
                id
                cantidad
                nombre
            }
            cliente {
                id
                nombre
                apellido
                email
                telefono
            }
            vendedor
            total
            estado
        }
    }
`;

const NuevoPedido = () => {

    // Ruteo
    const router = useRouter();

    // State para mensajes
    const [ mensaje, setMensaje ] = useState(null);
    
    // Utilizar context y extraer valores
    const pedidoContext = useContext( PedidoContext );
    const { cliente, productos, total } = pedidoContext;

    
    // Mutation para crear un nuevo pedido
    const [ nuevoPedido ] = useMutation( NUEVO_PEDIDO, {
        update(cache, { data: { nuevoPedido } }) {
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS
            });
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: [ ...obtenerPedidosVendedor, nuevoPedido ]
                }
            })
        }
    } );
    
    const validarPedido = () => {
        return !productos.every( producto => producto.cantidad > 0 ) || total === 0 || cliente.length === 0  ? " opacity-50 cursor-not-allowed " : "";
    }
    
    const registrarPedido = async () => {
        
        const { id } = cliente;
        // Dar formato al arreglo del pedido para enviar únicamente lo que se necesita
        const pedido = productos.map( ({ existencia, __typename, ...producto }) => producto );

        try {
            const { data } = await nuevoPedido({
                variables: {
                    input: {
                        cliente: id,
                        total,
                        pedido
                    }
                }
            });
            //console.log(data);
            // Redireccionar
            router.push('/pedidos');
            // Mostrar Alerta
            Swal.fire('¡Correcto!', 'Pedido almacenado satisfactoriamente', 'success');
        } catch (error) {
            setMensaje( error.message.replace('GraphQL error: ', '') );
            setTimeout(() => {
                setMensaje(null);
            }, 3000);
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
            <h1 className="text-2xl text-gray-800 font-light"> Crear Nuevo Pedido </h1>
            {
                mensaje && mostrarMensaje()
            }
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <AsignarCliente />
                    <AsignarProductos />
                    <ResumenPedido />
                    <Total />
                    <button
                        type="button"
                        className={ `bg-gray-800 w-full mt-5 p-2 text-white font-bold hover:bg-gray-900 ${ validarPedido() }` }
                        onClick={ registrarPedido }
                    >
                        Registrar Pedido
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoPedido;