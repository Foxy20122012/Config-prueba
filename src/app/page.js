"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // Ajusta la ruta según la ubicación real de tu componente Sidebar
import presets from "../utils/globalPresets";


const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const userObj = {
    compania: 'Company Name',
    nombre_usuario: 'John Doe',
    email: 'john@example.com'
  };

  const menu = [
    {
      id_menu: 1,
      title: "Opción 1",
      icon: "SomeIconComponent",
      path: "/opcion-1",
      children: [
        {
          id_menu: 2,
          title: "Subopción 1.1",
          icon: "SomeIconComponent",
          path: "/opcion-1/subopcion-1-1",
        },
      ],
    },
  ];

  const handleLogout = () => {
    // Lógica para cerrar sesión
  };

  

  useEffect(() => {
    document.title = "Página principal";
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        presets={presets}
        menu={menu}
        userObj={userObj}
        onClickLogout={handleLogout}
        sidebarStyles={"via-bg-sidebar"}
        optionStyles={"text-base font-normal via-options-sidebar"}
        suboptionStyles={"text-sm font-normal via-suboptions-sidebar"}
      />

      <div className="flex flex-col flex-1">
        <header className="w-full h-16 bg-gray-200"></header>
        <main className="flex-1 p-4"></main>
      </div>
    </div>
  );
};

export default Page;