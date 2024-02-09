"use client";
import { useEffect, useState, useContext } from "react";
import dynamic from "next/dynamic";
import presets from "@/utils/globalPresets";
import useI18n from '@/hooks/useI18n'
// import mensajes from '@/utils/i18n.';

// import { I18nContext } from '@/plugins/i18nContext';

import clientesModels from "../../models/clientesModels";

import SuccessModal from "../../components/SuccessModal";

const DataTable = dynamic(() => import("vComponents/dist/DataTable"), {
  ssr: false,
});
const VDialog = dynamic(
  () => {
    return import("vComponents/dist/VDialog");
  },
  { ssr: false }
);


const ClientesPage = () => {

  const mensajes = [
    {
      LENGUAJE: 'en',
      ID_MENSAJE: 'newItem',
      MENSAJE: 'New',
      ID_MENSAJE_PADRE: 'common'
    },
    {
      LENGUAJE: 'en',
      ID_MENSAJE: 'save',
      MENSAJE: 'Save',
      ID_MENSAJE_PADRE: 'common'
    },
    {
      LENGUAJE: 'es',
      ID_MENSAJE: 'newItem',
      MENSAJE: 'Nuevo',
      ID_MENSAJE_PADRE: 'common'
    },
    {
      LENGUAJE: 'es',
      ID_MENSAJE: 'save',
      MENSAJE: 'Guardar',
      ID_MENSAJE_PADRE: 'common'
    }
  ];
  const [headers, setHeaders] = useState([]); // Define tus cabeceras aquí
  const [items, setItems] = useState([]); // Define tus elementos aquí
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", email: "" });
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const i18n = useI18n()

  const obtenerFechaHace18Anios = () => {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 18);
    return hoy.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };

  const obtenerFechaHace100Anios = () => {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 100);
    return hoy.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };

  const handleFechaNacimientoChange = (e) => {
    const fechaNacimiento = e.target.value;
    const fechaHace18Anios = obtenerFechaHace18Anios();
    const fechaHace100Anios = obtenerFechaHace100Anios();

    if (
      fechaNacimiento > fechaHace18Anios ||
      fechaNacimiento < fechaHace100Anios
    ) {
      setFormData({
        ...formData,
        fecha_nacimiento: fechaNacimiento,
        fueraDeRango: true,
      });
    } else {
      setFormData({
        ...formData,
        fecha_nacimiento: fechaNacimiento,
        fueraDeRango: false,
      });
    }
  };

  const handleDeleteConfirmation = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true); // Muestra directamente el diálogo de eliminación
  };

  // Reemplaza la llamada directa a deleteUser con la apertura del diálogo de eliminación
  const handleDelete = (user) => {
    handleDeleteConfirmation(user);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const deleteData = (user) => {
    setSelectedUser(user);
    deleteUser();
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://apisuite.azurewebsites.net/api/data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spName: "SPR_CLIENTES_S",
            params: [],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error al llamar a la API: ${response.statusText}`);
      }

      const result = await response.json();

      console.log("Resultado de la llamada a la API:", result);

      if (result && Array.isArray(result.data)) {
        const usersArray = Array.isArray(result.data[0])
          ? result.data[0]
          : result.data;
        setUsers(usersArray);
      } else {
        console.error("Error al obtener usuarios desde la API");
      }
    } catch (error) {
      console.error("Error en la llamada a la API:", error);
    }
  };

  const insertUser = async () => {
    try {
      const response = await fetch(
        "https://apisuite.azurewebsites.net/api/data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spName: "SPR_CLIENTES_I",
            params: [
              formData.nombre,
              formData.apellido,
              formData.correo,
              formData.telefono,
              formData.direccion,
              formData.ciudad,
              formData.estado,
              formData.codigo_postal,
              formData.fecha_nacimiento,
              formData.notas,
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error al insertar cliente: ${response.statusText}`);
      }

      console.log("Cliente insertado exitosamente");
      fetchUsers();
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        estado: "",
        codigo_postal: "",
        fecha_nacimiento: "",
        notas: "",
      }); // Limpiar el formulario después de la inserción
    } catch (error) {
      console.error("Error al insertar cliente:", error);
    }
  };

  const updateUser = async () => {
    try {
      const response = await fetch(
        "https://apisuite.azurewebsites.net/api/data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spName: "SPR_UpdateUser",
            params: [selectedUser.id, formData.nombre, formData.email],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error al actualizar usuario: ${response.statusText}`);
      }

      console.log("Usuario actualizado exitosamente");
      fetchUsers();
      setFormData({ nombre: "", apellido: "" }); // Limpiar el formulario después de la actualización
      setSelectedUser(null); // Deseleccionar el usuario después de la actualización
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  const deleteUser = async () => {
    try {
      const response = await fetch(
        "https://apisuite.azurewebsites.net/api/data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spName: "SPR_DeleteUser",
            params: [selectedUser.id],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error al eliminar usuario: ${response.statusText}`);
      }

      console.log("Usuario eliminado exitosamente");
      fetchUsers();
      setSelectedUser(null); // Deseleccionar el usuario después de la eliminación
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  // Lógica para obtener y configurar las cabeceras y elementos, por ejemplo, useEffect o llamadas a API...
  useEffect(() => {
    setHeaders(clientesModels);
    // setItems(fetchedItems);
  }, []); // Dependencias vacías para que se ejecute una vez al montar el componente

  return (
    <>
    
      <DataTable
        className="flex items-center"
        headers={headers}
        items={users}
        i18n={{
          common: {
            newItem: 'Nuevo', // Define el texto directamente aquí
            save: 'Guardar', // Define el texto directamente aquí
          },
        }}
        presets={presets}
        onNewItem={() => setIsFormVisible(true)} // Abrir formulario al hacer clic en "Nuevo"
        onEditItem={(item) => {
          setSelectedUser(item);
          setFormData({ nombre: item.nombre, email: item.email });
          setIsFormVisible(true);
        }} // Abrir formulario con datos al hacer clic en "Editar"
        onDeleteItem={handleDelete} // Iniciar el proceso de eliminación al hacer clic en "Eliminar"
      />

      {isFormVisible && isFormVisible === true && (
        <VDialog
          isOpen={isFormVisible}
          size="sm"
          className="-translate-x-1/2 bg-black bg-opacity-25"
        >
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md ml-2">
            <form
              className="grid grid-cols-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="mb-4 mx-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="nombre"
                >
                  Nombre:<span className="text-red-600">(*)</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4 mx-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="apellido"
                >
                  Apellido: <span className="text-red-600">(*)</span>
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido: e.target.value })
                  }
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4 mx-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="correo"
                >
                  Correo: <span className="text-red-600">(*)</span>
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={(e) => {
                    // Expresión regular para validar el formato de correo electrónico
                    const emailRegex = /^[^\s@]/;
                    if (
                      emailRegex.test(e.target.value) ||
                      e.target.value === ""
                    ) {
                      setFormData({ ...formData, correo: e.target.value });
                    }
                  }}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ingrese su correo electrónico"
                />
              </div>

              <div className="mb-4 mx-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="telefono"
                >
                  Telefono: <span className="text-red-600">(*)</span>
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, ""); // Elimina cualquier caracter no numérico
                    setFormData({ ...formData, telefono: numericValue });
                  }}
                  pattern="\d*" // Expresión regular para permitir solo dígitos
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4 mx-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="direccion"
                >
                  Direccion: <span className="text-red-600">(*)</span>
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  required={true}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4 mx-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="ciudad"
                >
                  Municipio: <span className="text-red-600">(*)</span>
                </label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={(e) =>
                    setFormData({ ...formData, ciudad: e.target.value })
                  }
                  required={true}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline uppercase"
                />
              </div>

              <div className="mb-4 mx-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="estado"
                >
                  Departamento: <span className="text-red-600">(*)</span>
                </label>
                <input
                  type="text"
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                  onKeyPress={(e) => {
                    const regex = /^[a-zA-Z\s]*$/; // Expresión regular para permitir solo letras y espacios
                    if (!regex.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  required={true}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline uppercase"
                />
              </div>

              <div className="mb-4 mx-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="codigo_postal"
                >
                  Codigo Postal: <span className="text-red-600">(*)</span>
                </label>
                <input
                  type="number"
                  id="codigo_postal"
                  name="codigo_postal"
                  value={formData.codigo_postal}
                  onChange={(e) =>
                    setFormData({ ...formData, codigo_postal: e.target.value })
                  }
                  required={true}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                />
              </div>

              <div className="mb-4 mx-1">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="fecha_nacimiento"
      >
        fecha_nacimiento: <span className="text-red-600">(*)</span>
      </label>
      <input
        type="date"
        id="fecha_nacimiento"
        name="fecha_nacimiento"
        value={formData.fecha_nacimiento}
        onChange={handleFechaNacimientoChange}
        required={true}
        min={obtenerFechaHace100Anios()} // Establece la fecha mínima hace 100 años
        max={obtenerFechaHace18Anios()} // Establece la fecha máxima hace 18 años
        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />

      {formData.fueraDeRango && (
        <p className="text-red-600">
          La fecha debe estar entre hace 100 años y hace 18 años.
        </p>
      )}
    </div>

              <div className="mb-4 mx-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="notas"
                >
                  Notas : <span className="text-red-600">(*)</span>
                </label>
                <input
                  type="text"
                  id="notas"
                  name="notas"
                  value={formData.notas}
                  onChange={(e) =>
                    setFormData({ ...formData, notas: e.target.value })
                  }
                  required={true}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {!selectedUser ? (
                <button
                  type="button"
                  onClick={insertUser}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 flex justify-center rounded focus:outline-none focus:shadow-outline "
                >
                  Insertar Cliente
                </button>
              ) : (
                <button
                  type="button"
                  onClick={updateUser}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Actualizar Cliente
                </button>
              )}
            </form>

            <button
              type="button"
              onClick={() => setIsFormVisible(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded mt-4"
            >
              Cancelar
            </button>
          </div>
        </VDialog>
      )}

      {isDeleteModalOpen && (
        <VDialog
          isOpen={isDeleteModalOpen}
          size="sm"
          className="-translate-x-1/2 bg-black bg-opacity-25"
        >
          <div className="bg-white p-4 border rounded">
            <p className="text-lg font-bold mb-4">
              ¿Estás seguro de que deseas eliminar al registro?
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  deleteUser(); // Llama a deleteUser cuando se confirma la eliminación
                  setIsDeleteModalOpen(false);
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
              >
                Eliminar
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </VDialog>
      )}

      <SuccessModal
        isOpen={isDeleteSuccess}
        onClose={() => setIsDeleteSuccess(false)}
        message="El Registro se ha eliminado correctamente."
        buttonText="Aceptar"
      />

      <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Lista de Usuarios</h1>
      </div>
    </>
  );
};

export default ClientesPage;
