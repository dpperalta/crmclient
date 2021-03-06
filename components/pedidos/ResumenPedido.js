import React, { useContext } from 'react';
import PedidoContext from '../../context/pedidos/PedidoContext';
import ProductoResumen from './ProductoResumen';

const ResumenPedido = () => {

    // Context de pedidos
    const pedidoContext = useContext( PedidoContext );
    const { productos } = pedidoContext;
    //console.log( productos );

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">3. Configure las cantidades</p>
            {
                //productos.length > 0 || productos === null ? 
                //productos.length > 0 || !productos ? 
                //productos !== null || productos.length > 0 ? 
                productos !== null ? 
                (
                    <>
                        { productos.map( producto => (
                            <ProductoResumen 
                                key={ producto.id }
                                producto={ producto }
                            />
                        )) }
                    </>
                ) : 
                (
                    <p className="text-sm mt-5">Aún no se ha seleccionado ningún producto</p>
                )
            }
        </>
    );
}

export default ResumenPedido;