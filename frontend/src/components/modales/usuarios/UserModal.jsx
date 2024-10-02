import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const UserModal = ({ visible, onHide, user, onSave, onChange, mode, currentUserRole }) => {
    const estadoOptions = [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false }
    ];

    // Modificamos las opciones de rol para excluir Super Admin
    const rolOptions = [
        { label: 'Admin', value: 2 },
        { label: 'Común', value: 3 }
    ];

    const title = mode === 'create' ? 'Agregar Usuario' : 'Editar Usuario';

    // Función para determinar si se debe mostrar la opción de rol
    const shouldShowRolOption = () => {
        return currentUserRole === 1; // Solo Super Admin puede cambiar roles
    };

    return (
        <Dialog 
            header={title}
            visible={visible} 
            style={{ width: '50vw' }} 
            onHide={onHide}
            footer={
                <div>
                    <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                    <Button label="Guardar" icon="pi pi-check" onClick={onSave} autoFocus />
                </div>
            }
        >
            {user && (
                <div className="p-fluid">
                    <div className="p-field mb-3">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText id="nombre" name="nombre" value={user.nombre} onChange={onChange} />
                    </div>
                    <div className="p-field mb-3">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" name="email" value={user.email} onChange={onChange} />
                    </div>
                    {mode === 'create' && (
                        <div className="p-field mb-3">
                            <label htmlFor="contrasena">Contraseña</label>
                            <InputText id="contrasena" name="contrasena" type="password" value={user.contrasena} onChange={onChange} />
                        </div>
                    )}
                    {shouldShowRolOption() && (
                        <div className="p-field mb-3">
                            <label htmlFor="idrol">Rol</label>
                            <Dropdown 
                                id="idrol" 
                                name="idrol" 
                                value={user.idrol} 
                                options={rolOptions} 
                                onChange={onChange}
                                placeholder="Seleccione un rol" 
                            />
                        </div>
                    )}
                    <div className="p-field mb-3">
                        <label htmlFor="estado">Estado</label>
                        <Dropdown 
                            id="estado" 
                            name="estado" 
                            value={user.estado} 
                            options={estadoOptions} 
                            onChange={onChange}
                            placeholder="Seleccione un estado" 
                        />
                    </div>
                </div>
            )}
        </Dialog>
    );
};

export default UserModal;
