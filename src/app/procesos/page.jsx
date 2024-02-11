'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Page = () => {
  const [procesos, setProcesos] = useState([]);
  const [formData, setFormData] = useState({
    nombre_proceso: '',
    descripcion: '',
    url: '',
    usuario_id: '', // Asegúrate de proporcionar el ID del usuario actual
    paso: ''
  });

  useEffect(() => {
    const fetchProcesos = async () => {
      try {
        const response = await axios.get('https://bufeteapi.azurewebsites.net/api/obtenerprocesos');
        setProcesos(response.data);
      } catch (error) {
        console.error('Error fetching procesos:', error);
      }
    };

    fetchProcesos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://bufeteapi.azurewebsites.net/api/obtenerprocesos', formData);
      // Refrescar la lista de procesos después de la creación exitosa
      fetchProcesos();
      // Limpiar el formulario restableciendo el estado de formData
      setFormData({
        nombre_proceso: '',
        descripcion: '',
        url: '',
        usuario_id: '',
        paso: ''
      });
    } catch (error) {
      console.error('Error creating proceso:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Lista de Procesos</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {procesos.map((proceso) => (
            <div key={proceso.proceso_id} className="bg-white shadow-md rounded-md p-4">
              <h2 className="text-lg font-semibold mb-2">{proceso.nombre_proceso}</h2>
              <p className="text-gray-700 mb-4">{proceso.descripcion}</p>
              <a href={proceso.url} className="text-blue-500 hover:underline">Ver más</a>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Crear Proceso</h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-sm">
            <input type="text" name="nombre_proceso" value={formData.nombre_proceso} onChange={handleChange} placeholder="Nombre del Proceso" className="border border-gray-300 rounded-md p-2" />
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" className="border border-gray-300 rounded-md p-2"></textarea>
            <input type="text" name="url" value={formData.url} onChange={handleChange} placeholder="URL" className="border border-gray-300 rounded-md p-2" />
            <input type="text" name="usuario_id" value={formData.usuario_id} onChange={handleChange} placeholder="ID del Usuario" className="border border-gray-300 rounded-md p-2" />
            <input type="text" name="paso" value={formData.paso} onChange={handleChange} placeholder="Paso" className="border border-gray-300 rounded-md p-2" />
            <button type="submit" className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">Crear Proceso</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
