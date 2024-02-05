import React, { FC, useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  buttonText: string;
}

const SuccessModal: FC<SuccessModalProps> = ({ isOpen, onClose, message, buttonText }) => {

  useEffect(() => {
    if (isOpen) {
      // Aquí podrías añadir una animación de confeti más compleja usando una biblioteca o solución CSS/JS.
      // Por ahora, solo mostramos un mensaje en la consola.
      console.log("¡Lanzar confeti o animación aquí!");
    }
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="fixed inset-0 bg-black opacity-50"></div>

      <div className="bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-xl overflow-hidden z-50">
        <div className="p-8 bg-gray-100">
          <div className="flex justify-between items-center pb-4">
            <p className="text-3xl font-bold text-gray-800">¡Éxito!</p>
            <button onClick={onClose} className="text-3xl text-gray-600 hover:text-gray-500 transition-colors duration-300">&times;</button>
          </div>
          <p className="text-lg text-gray-700">{message}</p>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={onClose} 
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
