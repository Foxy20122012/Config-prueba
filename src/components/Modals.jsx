import React, { FC } from "react";
import PropTypes from "prop-types";

const Modals= ({
  isOpen,
  title,
  onConfirm,
  onCancel,
  onUpdate,
  showCancelButton = true,
  showConfirmButton = true,
  showUpdateButton = true,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white w-full md:w-1/2 lg:w-1/3 p-8 md:p-10 rounded-xl shadow-xl z-50 max-w-md">
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">{title}</h2>
        <div className="mb-8 text-gray-700">{children}</div>
        <div className="flex justify-center md:justify-end space-x-4">
          {showCancelButton && (
            <button
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
          {showUpdateButton && (
            <button
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              onClick={onUpdate}
            >
              Actualizar
            </button>
          )}
          {showConfirmButton && (
            <button
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              onClick={onConfirm}
            >
              Confirmar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

Modals.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showCancelButton: PropTypes.bool,
  showConfirmButton: PropTypes.bool,
  showUpdateButton: PropTypes.bool,
  children: PropTypes.node,
};

export default Modals;
