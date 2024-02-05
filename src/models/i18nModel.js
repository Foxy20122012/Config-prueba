/**
 * @brief modelo que sirve como base para inicializar los datos de un formulario
 * @brief no es necesario que direccionen uno a uno a campos de estructuras de persistencia (base de datos)
 * @brief no es necesario que direccionen uno a uno a pantallas pueden usarse uno o más en una pantalla
 * @returns las propiedades que inicializan un modelo de datos
 */
const i18nModel = () => {
  return {
    lenguaje: 'es',
    id_mensaje: '',
    mensaje: '',
    id_mensaje_padre: ''
  }
}

export default i18nModel
