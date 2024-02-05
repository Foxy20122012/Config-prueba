'use client'
import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import presets from "@/utils/globalPresets"
import fetchedHeaders from "../../models/encabezadoModel"

const DataTable = dynamic(() => import("vComponents/dist/DataTable"), { ssr: false });

const Page = () => {
  const [headers, setHeaders] = useState([]); // Define tus cabeceras aquí
  const [items, setItems] = useState([]); // Define tus elementos aquí
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://apisuite.azurewebsites.net/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spName: 'SPR_GetAllUsers',
          params: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al llamar a la API: ${response.statusText}`);
      }

      const result = await response.json();

      console.log('Resultado de la llamada a la API:', result);

      if (result && Array.isArray(result.data)) {
        const usersArray = Array.isArray(result.data[0]) ? result.data[0] : result.data;
        setUsers(usersArray);
      } else {
        console.error('Error al obtener usuarios desde la API');
      }
    } catch (error) {
      console.error('Error en la llamada a la API:', error);
    }
  };


  const insertUser = async () => {
    try {
      const response = await fetch('https://apisuite.azurewebsites.net/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spName: 'SPR_User_I',
          params: [formData.nombre, formData.email],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al insertar usuario: ${response.statusText}`);
      }

      console.log('Usuario insertado exitosamente');
      fetchUsers();
      setFormData({ nombre: '', email: '' }); // Limpiar el formulario después de la inserción
    } catch (error) {
      console.error('Error al insertar usuario:', error);
    }
  };

  const updateUser = async () => {
    try {
      const response = await fetch('https://apisuite.azurewebsites.net/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spName: 'SPR_UpdateUser',
          params: [selectedUser.id, formData.nombre, formData.email],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar usuario: ${response.statusText}`);
      }

      console.log('Usuario actualizado exitosamente');
      fetchUsers();
      setFormData({ nombre: '', email: '' }); // Limpiar el formulario después de la actualización
      setSelectedUser(null); // Deseleccionar el usuario después de la actualización
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const deleteUser = async () => {
    try {
      const response = await fetch('https://apisuite.azurewebsites.net/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spName: 'SPR_DeleteUser',
          params: [selectedUser.id],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar usuario: ${response.statusText}`);
      }

      console.log('Usuario eliminado exitosamente');
      fetchUsers();
      setSelectedUser(null); // Deseleccionar el usuario después de la eliminación
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

   // Lógica para obtener y configurar las cabeceras y elementos, por ejemplo, useEffect o llamadas a API...
   useEffect(() => {

  setHeaders(fetchedHeaders);
  // setItems(fetchedItems);
}, []); // Dependencias vacías para que se ejecute una vez al montar el componente


  return (
    <>      
    <DataTable headers={headers} items={users}  presets={presets} 
    onNewItem=""
    onEditItem=""
    onDeleteItem=""
    
   />
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Lista de Usuarios</h1>

      {/* Formulario */}
      <form className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Botones para insertar o actualizar */}
        {!selectedUser ? (
          <button
            type="button"
            onClick={insertUser}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Insertar Usuario
          </button>
        ) : (
          <button
            type="button"
            onClick={updateUser}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Actualizar Usuario
          </button>
        )}
      </form>

      {/* Lista de Usuarios */}
      <ul>
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <li key={user.id} className="mb-4 border p-4 rounded">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-bold">{user.nombre}</h2>
                  <p className="text-gray-700">{user.email}</p>
                </div>
                <div>
                  {/* Botones para editar y eliminar */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(user);
                      setFormData({ nombre: user.nombre, email: user.email });
                    }}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(user);
                      deleteUser();
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li>No hay usuarios disponibles</li>
        )}
      </ul>
    </div>
    </>
  );
};

export default Page;
