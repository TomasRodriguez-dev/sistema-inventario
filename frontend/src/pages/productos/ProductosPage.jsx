import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { useAlert } from '../../context/AlertContext';
import environment from '../../services/enviroment';
import api from '../../services/api';
import { Tag } from 'primereact/tag';
import ProductModal from '../../components/modales/productos/ProductModal';
import { Card } from 'primereact/card';
import 'primeflex/primeflex.css';
import { useUser } from '../../context/UserContext';

const ProductosPage = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    const [currentProduct, setCurrentProduct] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const { user } = useUser();

    console.log(user);

    const fetchProductos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(environment.productos.listar_productos);
            if (response.data && response.data.productos) {
                setProductos(response.data.productos);
            }
        } catch (error) {
            console.error('Error al obtener productos:', error);
            showAlert('error', 'Error al cargar los productos');
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);


    const openModal = (product = null) => {
        if (product) {
            setCurrentProduct({ ...product });
            setModalMode('edit');
        } else {
            setCurrentProduct({ nombre: '', descripcion: '', precio: '', cantidad: '', activo: true });
            setModalMode('create');
        }
        setModalVisible(true);
    };   
    
    const closeModal = () => {
        setCurrentProduct(null);
        setModalVisible(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({ ...prev, [name]: value }));
    };

    const saveProduct = async () => {
        try {
            let response;
            const productData = {
                nombre: currentProduct.nombre,
                descripcion: currentProduct.descripcion,
                precio: Number(currentProduct.precio),
                cantidad: Number(currentProduct.cantidad)
            };
            
            if (modalMode === 'create') {
                response = await api.post(environment.productos.crear_producto, productData);
            } else {
                response = await api.patch(`${environment.productos.editar_producto}/${currentProduct.id}`, productData);
            }
            
            if (response.data) {
                showAlert('success', `Producto ${modalMode === 'create' ? 'creado' : 'actualizado'} con éxito`);
                fetchProductos();
                closeModal();
            }
        } catch (error) {
            console.error(`Error al ${modalMode === 'create' ? 'crear' : 'editar'} producto:`, error);
            showAlert('error', `Error al ${modalMode === 'create' ? 'crear' : 'editar'} el producto`);
        }
    };

    /**
     * Funcion para eliminar un usuario
     * @param {Object} user - El usuario seleccionado
     */
    const deleteProduct = async (product) => {
        try {
            const response = await api.delete(`${environment.productos.eliminar_producto}/${product.id}`);
            if (response.data) {
                showAlert('success', 'Producto eliminado con éxito');
                fetchProductos();
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            showAlert('error', 'Error al eliminar el producto');
        }
    };

    /**
     * Funcion para mostrar el estado del usuario
     * @param {Object} rowData - El usuario seleccionado
     * @returns {React.Fragment} - El estado del usuario
     */
    const activoBodyTemplate = (rowData) => {
        const status = rowData.activo ? 'Activo' : 'Inactivo';
        return <Tag value={status} severity={getSeverity(rowData.activo)} />;
    };

    
    /**
     * Funcion para obtener el color del estado del usuario
     * @param {Boolean} status - El estado del usuario
     * @returns {String} - El color del estado
     */
    const getSeverity = (status) => {
        return status ? 'success' : 'danger';
    };

    /**
     * Funcion para mostrar los botones de accion
     * @param {Object} rowData - El usuario seleccionado
     * @returns {React.Fragment} - Los botones de accion
     */
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => openModal(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => deleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    /**
     * Función para formatear un número al formato de moneda argentina
     * @param {Number} value - El valor numérico a formatear
     * @returns {String} - El valor formateado como moneda argentina
     */
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
    };

    // Componente para mostrar productos en formato de tarjeta
    const ProductCard = ({ product }) => (
        <Card
            title={product.nombre}
            subTitle={`Precio: ${formatCurrency(product.precio)}`}
            className="w-24rem shadow-3 "
            header={<img alt="Producto" src="https://via.placeholder.com/250" className="w-full h-18rem object-fit-cover" />}
        >
            <p className="m-0">{product.descripcion}</p>
            <p className="m-0">Cantidad: {product.cantidad}</p>
        </Card>
    );

    return (
        <div>
            {user?.rol === 'USER' ? (
                <div className="flex flex-wrap justify-content-center gap-6">
                    {productos.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div>
                    <div className="mb-6 flex justify-content-end ">
                        <Button label="Agregar Producto" icon="pi pi-plus" className="p-button-success" onClick={() => openModal()} />
                    </div>
                    <div className="card shadow-3">
                        <DataTable value={productos} paginator rows={5} dataKey="id" loading={loading}
                                emptyMessage="No se encontraron productos" rowsPerPageOptions={[5, 10, 25, 50]}>
                            <Column field="id" header="ID" style={{ width: '10%' }}></Column>
                            <Column field="nombre" header="Nombre" style={{ width: '20%' }}></Column>
                            <Column field="descripcion" header="Descripción"  style={{ width: '20%' }}></Column>
                            <Column field="precio" header="Precio" style={{ width: '15%' }}></Column>
                            <Column field="cantidad" header="Cantidad" style={{ width: '15%' }}></Column>
                            <Column field="activo" header="Activo" body={activoBodyTemplate} style={{ width: '15%' }}></Column>
                            <Column body={actionBodyTemplate} exportable={false} style={{ width: '20%' }}></Column>
                        </DataTable>
                    </div>
                </div>
            )}
            <ProductModal
                visible={modalVisible}
                onHide={closeModal}
                product={currentProduct}
                onSave={saveProduct}
                onChange={handleInputChange}
                mode={modalMode}
            />
        </div>
    );
}

export default ProductosPage;