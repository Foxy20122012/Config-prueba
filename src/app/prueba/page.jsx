'use client'
import { useEffect, useState } from 'react';

const Page = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
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

        // Verificamos si 'data' es un array
        if (result && Array.isArray(result.data)) {
          // Si 'data' es un array de arrays, extraemos el primer array
          const usersArray = Array.isArray(result.data[0]) ? result.data[0] : result.data;
          setUsers(usersArray);
        } else {
          console.error('Error al obtener usuarios desde la API');
        }
      } catch (error) {
        console.error('Error en la llamada a la API:', error);
      }
    };

    fetchUsers();
  }, []);

  console.log('Usuarios:', users);

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <ul>
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>{user.nombre},{user.email}</li>
            // <li key={user.id}>{user.email}</li>
          ))
        ) : (
          <li>No hay usuarios disponibles</li>
        )}
      </ul>
    </div>
  );
};

export default Page;
