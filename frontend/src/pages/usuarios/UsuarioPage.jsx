import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import api from '../../services/api';
import environment from '../../services/enviroment';
import { useAlert } from '../../context/AlertContext';

const UsuarioPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const { showAlert } = useAlert();

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(environment.usuarios.listar_usuarios);
            if (response.data && response.data.usuarios) {
                setUsers(response.data.usuarios);
            }
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            showAlert('error', 'Error al cargar los usuarios');
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    /**
     * Funcion para abrir el modal de edicion
     * @param {Object} user - El usuario seleccionado
     */
    const openEditModal = (user) => {
        setEditingUser({ ...user });
        setEditModalVisible(true);
    };

    /**
     * Funcion para cerrar el modal de edicion
     */
    const closeEditModal = () => {
        setEditingUser(null);
        setEditModalVisible(false);
    };

    /**
     * Funcion para manejar el cambio de los inputs
     * @param {Event} e - El evento del input
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingUser(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Funcion para editar un usuario
     */
    const editUser = async () => {
        try {
            const response = await api.put(`${environment.usuarios.editar_usuario}/${editingUser.id}`, editingUser);
            
            if (response.data) {
                showAlert('success', 'Usuario actualizado con éxito');
                fetchUsers();
                closeEditModal();
            }
        } catch (error) {
            console.error('Error al editar usuario:', error);
            showAlert('error', 'Error al editar el usuario');
        }
    };

    /**
     * Funcion para mostrar el estado del usuario
     * @param {Object} rowData - El usuario seleccionado
     * @returns {React.Fragment} - El estado del usuario
     */
    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.estado} severity={getSeverity(rowData.estado)} />;
    };

    /**
     * Funcion para obtener el color del estado del usuario
     * @param {String} status - El estado del usuario
     * @returns {String} - El color del estado
     */
    const getSeverity = (status) => {
        switch (status) {
            case 'activo':
                return 'success';
            case 'inactivo':
                return 'danger';
            default:
                return null;
        }
    };

    /**
     * Funcion para mostrar los botones de accion
     * @param {Object} rowData - El usuario seleccionado
     * @returns {React.Fragment} - Los botones de accion
     */
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => openEditModal(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => deleteUser(rowData)} />
            </React.Fragment>
        );
    };

    /**
     * Funcion para eliminar un usuario
     * @param {Object} user - El usuario seleccionado
     */
    const deleteUser = async (user) => {
        try {
            const response = await api.delete(`${environment.usuarios.eliminar_usuario}/${user.id}`);
            if (response.data) {
                showAlert('success', 'Usuario eliminado con éxito');
                fetchUsers();
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            showAlert('error', 'Error al eliminar el usuario');
        }
    };

    /**
     * Funcion para renderizar el modal de edicion
     * @returns {React.Fragment} - El modal de edicion
     */
    const renderEditModal = () => {
        const estadoOptions = [
            { label: 'Activo', value: 'activo' },
            { label: 'Inactivo', value: 'inactivo' }
        ];

        return (
            <Dialog 
                header="Editar Usuario" 
                visible={editModalVisible} 
                style={{ width: '50vw' }} 
                onHide={closeEditModal}
                footer={
                    <div>
                        <Button label="Cancelar" icon="pi pi-times" onClick={closeEditModal} className="p-button-text" />
                        <Button label="Guardar" icon="pi pi-check" onClick={editUser} autoFocus />
                    </div>
                }
            >
                {editingUser && (
                    <div className="p-fluid">
                        <div className="p-field mb-3">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" name="nombre" value={editingUser.nombre} onChange={handleInputChange} />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" name="email" value={editingUser.email} onChange={handleInputChange} />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="estado">Estado</label>
                            <Dropdown id="estado" name="estado" value={editingUser.estado} options={estadoOptions} onChange={handleInputChange} placeholder="Seleccione un estado" />
                        </div>
                    </div>
                )}
            </Dialog>
        );
    };

    return (
        <div className="card shadow-3">
            <DataTable value={users} paginator rows={5} dataKey="id" loading={loading}
                    emptyMessage="No se encontraron usuarios" rowsPerPageOptions={[5, 10, 25, 50]}>
                <Column field="id" header="ID" style={{ width: '10%' }}></Column>
                <Column field="nombre" header="Nombre" style={{ width: '25%' }}></Column>
                <Column field="email" header="Email"  style={{ width: '25%' }}></Column>
                <Column field="estado" header="Estado" body={statusBodyTemplate}  style={{ width: '20%' }}></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ width: '20%' }}></Column>
            </DataTable>
            {renderEditModal()}
        </div>
    );
};

export default UsuarioPage;
