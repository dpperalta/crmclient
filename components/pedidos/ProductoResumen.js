import React, { useContext, useEffect, useState } from 'react';
import PedidoContext from '../../context/pedidos/PedidoContext';

const ProductoResumen = ({ producto }) => {

    // Context de Pedidos
    const pedidoContext = useContext( PedidoContext );
    const { agregarCantidadProductos, actualizarTotal } = pedidoContext;

    // State local para el manejo de cambios en el total
    const [ cantidad, setCantidad ] = useState(0);

    // Use Efect para escuchar los cambios en las cantidades
    useEffect(() => {
        actualizarCantidad();
        actualizarTotal();
    }, [ cantidad ]);

    // Función para actualizar las cantidades
    const actualizarCantidad = () => {
        // Se crea una nueva variable para modificar el state con las nuevas cantidades, nuevoProducto = a una nueva instancia de la suma de cantidades
        const nuevoProducto = {
            ...producto,
            cantidad: Number( cantidad )
        }
        agregarCantidadProductos( nuevoProducto );
    }

    const { nombre,  precio, existencia } = producto;

    return (
        <div className="md:flex md:justify-between md:items-center mt-5">
            <div className="md:w-2/4 mb-2 md:mb-0">
                <p className="text-sm">{ nombre }</p>
                <p>$ { precio } </p>
            </div>
            <input 
                type="number"
                placeholder="Cantidad"
                className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
                onChange={ e => setCantidad( e.target.value ) }
                value={ cantidad }
            />
        </div>
    );
}

export default ProductoResumen;