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
        { label: 'Admin', value: 'ADMIN' },
        { label: 'Común', value: 'USER' }
    ];

    const title = mode === 'create' ? 'Agregar Usuario' : 'Editar Usuario';

    // Función para determinar si se debe mostrar la opción de rol
    const shouldShowRolOption = () => {
        return currentUserRole === 'SUPERADMIN'; // Solo Super Admin puede cambiar roles
    };

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
            {user && (
                <div className="p-fluid">
                    <div className="p-field mb-3">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText id="nombre" name="nombre" value={user.nombre} onChange={onChange} />
                    </div>
                    <div className="p-field mb-3">
                        <label htmlFor="correo">E-mail</label>
                        <InputText id="correo" name="correo" value={user.correo} onChange={onChange} />
                    </div>
                    {mode === 'create' && (
                        <div className="p-field mb-3">
                            <label htmlFor="contrasenia">Contraseña</label>
                            <InputText id="contrasenia" name="contrasenia" type="password" value={user.contrasenia} onChange={onChange} />
                        </div>
                    )}
                    {shouldShowRolOption() && (
                        <div className="p-field mb-3">
                            <label htmlFor="rol">Rol</label>
                            <Dropdown 
                                id="rol" 
                                name="rol" 
                                value={user.rol} 
                                options={rolOptions} 
                                onChange={onChange}
                                placeholder="Seleccione un rol" 
                            />
                        </div>
                    )}
                    <div className="p-field mb-3">
                        <label htmlFor="disponible">Estado</label>
                        <Dropdown 
                            id="disponible" 
                            name="disponible" 
                            value={user.disponible} 
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
