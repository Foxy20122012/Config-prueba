'use client';
import { useEffect, useState } from 'react';
import { execute } from '@/helper/clientApi';
import environment from '@/utils/environment';

const Page = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Llamada a la función execute con los parámetros necesarios
        const result = await execute('SPR_GetAllUsers', [], 0, false, {
          api: environment.constants.urlWebApi,
          env: process.env.NODE_ENV,
          exposeRoute: 'data',
        });

        console.log('Resultado de la llamada a la API:', result);

        // Verificamos si 'data' es un array
        if (result && Array.isArray(result)) {
          // Si 'data' es un array de arrays, extraemos el primer array
          const usersArray = Array.isArray(result[0]) ? result[0] : result;
          setUsers(usersArray);
        } else {
          console.error('Error al obtener usuarios desde la API. Formato de datos incorrecto:', result);
          setError('Error al obtener usuarios desde la API. Formato de datos incorrecto.');
        }
      } catch (error) {
        console.error('Error en la llamada a la API:', error);
        setError('Error en la llamada a la API: ' + error.message);
      }
    };

    fetchUsers();
  }, []);

  console.log('Usuarios:', users);

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <li key={user.id}>{user.nombre}, {user.email}</li>
            ))
          ) : (
            <li>No hay usuarios disponibles</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Page;
