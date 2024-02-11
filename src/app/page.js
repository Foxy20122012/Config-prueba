"use client";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [procesos, setProcesos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProcesos = async () => {
      try {
        // Hacer la solicitud GET a la API para obtener los procesos del usuario
        const response = await fetch(
          "https://bufeteapi.azurewebsites.net/api/procesos",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Incluir el token JWT almacenado en localStorage
            },
          }
        );

        // Verificar si la solicitud fue exitosa
        if (response.ok) {
          // Convertir la respuesta a formato JSON
          const data = await response.json();
          // Establecer los procesos en el estado
          setProcesos(data);
        } else {
          // Si hay un error en la solicitud, lanzar un error
          throw new Error("Error al obtener los procesos del usuario");
        }
      } catch (error) {
        // Capturar y manejar errores
        console.error("Error:", error);
        setError(error.message);
      }
    };

    // Llamar a la función para obtener los procesos del usuario cuando el componente se monte
    obtenerProcesos();
  }, []);

  return (
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <h1 class="text-3xl font-bold text-gray-800 bg-gray-100 py-4 px-6 mb-6 rounded-t-lg">
        Procesos del Usuario
      </h1>
      {error && <p class="text-red-600 mb-4 px-6">Error: {error}</p>}
      <ul>
        {procesos.map((proceso) => (
          <li
            key={proceso.id}
            class="px-6 py-4 border-b border-gray-200 hover:bg-gray-50"
          >
            <p class="text-lg font-semibold text-gray-900 mb-2">
              {proceso.nombre_proceso}
            </p>
            <p class="text-gray-800">{proceso.descripcion}</p>
            {/* Mostrar más detalles del proceso si es necesario */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
