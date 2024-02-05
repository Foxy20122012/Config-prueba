/** 
* @brief son modelos que permiten definir columnas de un componente DataTable y/o campos (inputs) de un formulario 
* @brief no es necesario que direccionen uno a uno a campos de estructuras de persistencia (base de datos) 
* @brief no es necesario que direccionen uno a uno a pantallas pueden usarse uno o más en una pantalla 
* @returns listado de objetos que definen propiedades de visualización y/o validación 
*/ 
const i18nProps = () => { // se agregan comentarios para indicar todas la propiedades posibles para las columnas del datatable y campos o inputs en los formularios 
    return [ 
    
    { 
    text: '', // etiqueta que aparece en el campo 
    i18n: 'etiquetas.lenguaje', // si tiene asociado una traduccion 
    value: 'lenguaje', // la propiedad del modelo (este datos es requerido) 
    listName: 'LENGUAJE', // nombre de la lista de valores (comunes, ejemplo: SINO, ESTADO), se utiliza en inputs tipo select 
    // listNameParams: '', // nombre de la lista de valores con parametros (que vienen de un catalogo), se utiliza en inputs tipo autocomplete 
    // fixedListParams: ['es', null, null], // parámetros fijos que se envían al llamar a los catalogos listNameParams 
    class: 'text-center w-24', // las clases css (tailwind) para darle diseño a la celda del datatable 
    headerClass: 'w-24', // clases css (tailwind) para darle diseño al encabezado del datatable 
    // disableOnNew: true, // indica true si no se permite modificación al momento de agregar 
    disableOnEdit: true, // indica true si no se permite modificación al momento de editar 
    // isKey: 'ID', // indica si al input se le agrega un texto 
    defaultValue: 'es', // valor que puede tener el texto 
    // showInForm: false, // si se omite se asume true, false: indica que solo se muestra en el datatable y no en el formulario 
    // showAsBadge: true, // si se omite se asume false, true: indica que se muestra como un conteo 
    // icon: 'TableCellsIcon', // indica que la columna se muestra como un icono, el nombre del icono es basado en HeroIcons 
    // iconClass: 'via-detalle-datatable', // clase para formatear el icono definida en la carpeta /styles pueden ser @apply (no se utilizan clase tailwind aqui porque se generan en tiempo de ejecución) 
    // badgeClass: 'via-badge-datatable', // clase para formatear el badge del contador definida en la carpeta /styles pueden ser @apply (no se utilizan clase tailwind aqui porque se generan en tiempo de ejecución) 
    // toLocation: '/mantenimientos/otrapagina', // si al presionar el icono se necesita enviar a otra página (destino) 
    // fromLocation: '/mantenimientos/estapagina', // para que la página destino pueda regresar a la página origen 
    // fromTitle: 'tipoExpediente.tituloTipoExpediente', // traducción i18n del titulo de la página origen 
    
    // format: (val) => { // función que permite modificar el dato ingresado al darle blur al input, no aplica a type autocomplete y file 
    // return val.toLowerCase() 
    // }, 
    
    // substituteVal: (item) => { // permite hacer el reemplazo visual del valor del campo por otro del objeto o item, ejemplo: el id por la descripcion 
    // // este reemplazo solo es disponible en el DataTable 
    // return item.desc_lenguaje 
    // }, 
    
    // onChange: (val, item) => { // funcion callback que se llama al cambiar de valor el input, se debe definir dentro de la pantalla donde se utiliza el props 
    // tomar en cuenta que es una funcion asincrona y devuelve el valor antes de aplicar la funcion format y validar la forma 
    // DO Something 
    // } 
    
    // classItem: (val) => { // función que permite establecer un estilo usando clases css según el valor del item o campo 
    // if (val.color_semaforo === 'VA_VERDE') { 
    // return 'via-bg-verde' 
    // } else if (val.color_semaforo === 'VA_AMARILLO') { 
    // return 'via-bg-amarillo' 
    // } 
    // return 'via-bg-rojo' 
    // }, 
    
    // define datos que se utilizan si se requiere incluir el campo como filtro del datatable 
    // isFilter: true, // indica que el campo es un filtro del datatable 
    // type: 'string', // string: el filtro se evalua como cadena, date: el filtro se evalua como fecha, number: el filtro se evalua como número 
    // label: 'Color', // etiqueta que se muestra en el filtro 
    // filterOrder: 7, // indica la posicion en la que se muestra el filtro de todos los campos marcados como filtro 
    // filterType: 'button', // button: el filtro se muestra como botones, autocomplete: el filtro se muestra como un combobox 
    // isSearchable: true, // true: permite buscar al escribir para seleccionar el dato 
    // isMulti: true, // true: permite seleccione multiple, false: solo se puede seleccionar un dato 
    // isGroup: false, // true: indica que el campo se puede agrupar en el datatable, false: el campo no es parte de una agrupacion 
    
    pristineMessages: { // mensajes que se muestran al validar el ingreso de campos 
    'required': 'common.ruleRequired', // mensaje que se muestra si el dato es requerido 
    // 'pattern': 'common.ruleUpperCase', // mensaje que se muestra en la regla PATTERN 
    'minlength': 'common.ruleMinChars', // mensaje que se muestra si hay un minimo de caracteres requeridos 
    'minlength-params':{ label: '2' }, // cantidad de caracteres requeridos minLength 
    'maxlength': 'common.ruleMaxChars', // mensaje que se muestra si hay un maximo de caracteres requeridos 
    'maxlength-params': { label: '2' } // cantidad de caracteres requeridos maxLength 
    }, 
    inputProps: { 
    type: 'select', // los tipos permitidos por html (ref https://www.w3schools.com/html/html_form_input_types.asp), adicional se agrega autocomplete para un combobox que permite busqueda 
    required: true, // true: si el campo es requerido, false: si el campo no es obligatorio 
    minLength: 2, // la cantidad minima de caracteres requeridos 
    maxLength: 2, // la cantidad maxima de caracteres requeridos 
    // pattern:"/[a-z]+$/i", // expresion regular con la que se debe validar el ingreso del dato, esto se puede omitir 
    autoComplete: "off", // en algunos navegadores se utiliza para que no sugiera el datos 
    autoFocus: false // indica si el campo recibo el foco al ingresar al formulario 
    } 
    }, 
    
    { 
    text: '', 
    i18n: 'etiquetas.idMensaje', 
    value: 'id_mensaje', 
    isKey: 'ID', 
    disableOnEdit: true, 
    // substituteVal: (item) => { // permite hacer el reemplazo visual del valor del campo por otro del objeto o item, ejemplo: el id por la descripcion 
    // // este reemplazo solo es disponible en el DataTable 
    // return item.desc_lenguaje 
    // }, 
    pristineMessages: { 
    'required': 'common.ruleRequired', 
    'minlength': 'common.ruleMinChars', // mensaje que se muestra si hay un minimo de caracteres requeridos 
    'minlength-params':{ label: '5' }, // cantidad de caracteres requeridos minLength 
    'maxlength': 'common.ruleMaxChars', // mensaje que se muestra si hay un maximo de caracteres requeridos 
    'maxlength-params': { label: '100' } // cantidad de caracteres requeridos maxLength 
    }, 
    inputProps: { 
    type: 'text', // los tipos permitidos por html (ref https://www.w3schools.com/html/html_form_input_types.asp), adicional se agrega autocomplete para un combobox que permite busqueda 
    required: true, // true: si el campo es requerido, false: si el campo no es obligatorio 
    minLength: 5, // la cantidad minima de caracteres requeridos 
    maxLength: 100, // la cantidad maxima de caracteres requeridos 
    autoComplete: "off", // en algunos navegadores se utiliza para que no sugiera el datos 
    autoFocus: true // indica si el campo recibo el foco al ingresar al formulario 
    } 
    }, 
    { 
    text: '', 
    i18n: 'etiquetas.mensaje', 
    value: 'mensaje', 
    pristineMessages: { 
    'required': 'common.ruleRequired', 
    'minlength': 'common.ruleMinChars', 
    'minlength-params':{ label: '5' }, 
    'maxlength': 'common.ruleMaxChars', 
    'maxlength-params': { label: '4000' } 
    }, 
    inputProps: { 
    type: 'textarea', 
    required: true, 
    minLength: 5, 
    maxLength: 4000, 
    autoComplete: "off", 
    autoFocus: false 
    } 
    }, 
    { 
    text: '', 
    i18n: 'etiquetas.pantalla', 
    value: 'id_mensaje_padre', 
    listNameParams: 'etiquetas', 
    fixedListParams: ['es', null, null], 
    isFilter: true, 
    type: 'string', 
    label: 'Pantalla', 
    filterOrder: 1, 
    filterType: 'autocomplete', 
    isGroup: false, 
    isMulti: false, 
    isSearcheable: true, 
    isClearable: true, 
    pristineMessages: { 
    'required': 'common.ruleRequired' 
    }, 
    inputProps: { 
    type: 'autocomplete', 
    required: false, 
    } 
    }, 
    
    ] 
    } 
    
    export default i18nProps 