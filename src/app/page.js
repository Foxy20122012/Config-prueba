'use client'
import React, { useState, useEffect } from 'react';

const Page = () => {
    const [procesos, setProcesos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerProcesos = async () => {
            try {
                // Hacer la solicitud GET a la API para obtener los procesos del usuario
                const response = await fetch('https://bufeteapi.azurewebsites.net/api/procesos', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Incluir el token JWT almacenado en localStorage
                    }
                });
                
                // Verificar si la solicitud fue exitosa
                if (response.ok) {
                    // Convertir la respuesta a formato JSON
                    const data = await response.json();
                    // Establecer los procesos en el estado
                    setProcesos(data);
                } else {
                    // Si hay un error en la solicitud, lanzar un error
                    throw new Error('Error al obtener los procesos del usuario');
                }
            } catch (error) {
                // Capturar y manejar errores
                console.error('Error:', error);
                setError(error.message);
            }
        };

        // Llamar a la función para obtener los procesos del usuario cuando el componente se monte
        obtenerProcesos();
    }, []);

    return (
        <div>
            <h1>Procesos del Usuario</h1>
            {error && <p>Error: {error}</p>}
            <ul>
                {procesos.map(proceso => (
                    <li key={proceso.id}>
                        <p>Nombre del Proceso: {proceso.nombre_proceso}</p>
                        <p>Descripción: {proceso.descripcion}</p>
                        {/* Mostrar más detalles del proceso si es necesario */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Page;
