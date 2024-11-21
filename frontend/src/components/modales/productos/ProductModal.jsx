import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const ProductModal = ({ visible, onHide, product, onSave, onChange, mode }) => {

    const title = mode === 'create' ? 'Agregar Producto' : 'Editar Producto';

    return (
        <Dialog 
            header={title}
            visible={visible} 
            style={{ width: '50vw' }} 
            onHide={onHide}
            footer={
                <div>
                    <Button label="Guardar" icon="pi pi-check" onClick={onSave} autoFocus />
                </div>
            }
        >
            {product && (
                <div className="p-fluid">
                    <div className="p-field mb-3">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText id="nombre" name="nombre" value={product.nombre} onChange={onChange} />
                    </div>
                    <div className="p-field mb-3">
                        <label htmlFor="descripcion">Descripción</label>
                        <InputText id="descripcion" name="descripcion" value={product.descripcion} onChange={onChange} />
                    </div>
                    <div className="p-field mb-3">
                        <label htmlFor="precio">Precio</label>
                        <InputText id="precio" name="precio" value={product.precio} onChange={onChange} />
                    </div>
                    <div className="p-field mb-3">
                        <label htmlFor="activo">Cantidad</label>
                        <InputText id="cantidad" name="cantidad" value={product.cantidad} onChange={onChange} />
                    </div>
                </div>
            )}
        </Dialog>
    );
};

export default ProductModal;