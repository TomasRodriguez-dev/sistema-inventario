import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import api from '../../services/api';
import environment from '../../services/enviroment';
import { useAlert } from '../../context/AlertContext';
import UserModal from '../../components/modales/usuarios/UserModal';
import { useUser } from '../../context/UserContext';

const UsuarioPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [modalMode, setModalMode] = useState('create');
    const { showAlert } = useAlert();
    const { user: currentLoggedUser } = useUser();

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

    const openModal = (user = null) => {
        if (user) {
            setCurrentUser({ ...user });
            setModalMode('edit');
        } else {
            setCurrentUser({ nombre: '', correo: '', contrasenia: '', rol: 'USER', disponible: true });
            setModalMode('create');
        }
        setModalVisible(true);
    };

    const closeModal = () => {
        setCurrentUser(null);
        setModalVisible(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser(prev => ({ ...prev, [name]: value }));
    };

    const saveUser = async () => {
        try {
            let response;
            const userData = {
                nombre: currentUser.nombre,
                correo: currentUser.correo,
                rol: currentUser.rol,
                disponible: currentUser.disponible
            };
            
            if (modalMode === 'create') {
                userData.contrasenia = currentUser.contrasenia;
                response = await api.post(environment.usuarios.crear_usuario, userData);
            } else {
                response = await api.patch(`${environment.usuarios.editar_usuario}/${currentUser.id}`, userData);
            }
            
            if (response.data) {
                showAlert('success', `Usuario ${modalMode === 'create' ? 'creado' : 'actualizado'} con éxito`);
                fetchUsers();
                closeModal();
            }
        } catch (error) {
            console.error(`Error al ${modalMode === 'create' ? 'crear' : 'editar'} usuario:`, error);
            showAlert('error', `Error al ${modalMode === 'create' ? 'crear' : 'editar'} el usuario`);
        }
    };

    /**
     * Función para obtener el nombre del rol basado en el ID
     * @param {string} rol - El rol
     * @returns {string} - El nombre del rol
     */
    const getRolName = (rol) => {  
        switch (rol) {
            case 'SUPERADMIN':
                return 'Super Admin';
            case 'ADMIN':
                return 'Admin';
            case 'USER':
                return 'Común';
            default:
                return 'Desconocido';
        }
    };

    /**
     * Función para mostrar el rol del usuario
     * @param {Object} rowData - El usuario seleccionado
     * @returns {React.Fragment} - El rol del usuario
     */
    const rolBodyTemplate = (rowData) => {
        const rolName = getRolName(rowData.rol);
        return <span>{rolName}</span>;
    };

    /**
     * Funcion para mostrar el estado del usuario
     * @param {Object} rowData - El usuario seleccionado
     * @returns {React.Fragment} - El estado del usuario
     */
    const statusBodyTemplate = (rowData) => {
        const status = rowData.disponible ? 'Activo' : 'Inactivo';
        return <Tag value={status} severity={getSeverity(rowData.disponible)} />;
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

    return (
        <div>
            <div className="mb-6 flex justify-content-end ">
                <Button label="Agregar Usuario" icon="pi pi-plus" className="p-button-success" onClick={() => openModal()} />
            </div>
            <div className="card shadow-3">
                <DataTable value={users} paginator rows={5} dataKey="id" loading={loading}
                        emptyMessage="No se encontraron usuarios" rowsPerPageOptions={[5, 10, 25, 50]}>
                    <Column field="id" header="ID" style={{ width: '10%' }}></Column>
                    <Column field="nombre" header="Nombre" style={{ width: '20%' }}></Column>
                    <Column field="correo" header="Email"  style={{ width: '20%' }}></Column>
                    <Column field="rol" header="Rol" body={rolBodyTemplate} style={{ width: '15%' }}></Column>
                    <Column field="disponible" header="Estado" body={statusBodyTemplate}  style={{ width: '15%' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ width: '20%' }}></Column>
                </DataTable>
                <UserModal 
                    visible={modalVisible}
                    onHide={closeModal}
                    user={currentUser}
                    onSave={saveUser}
                    onChange={handleInputChange}
                    mode={modalMode}
                    currentUserRole={currentLoggedUser?.rol}
                />
            </div>
        </div>
    );
};

export default UsuarioPage;