'use client'
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { toast } from 'react-toastify'
import { findIndex } from "underscore"
import { execute } from "@/helper/clientApi"
import useI18n from '@/hooks/useI18n'
import useLoading from "@/hooks/useLoading"
import useHasMounted from '@/hooks/useHasMounted'
import presets from "@/utils/globalPresets"
import environment from "@/utils/environment"
import i18nProps from "@/models/i18nProps"
import i18nModel from "@/models/i18nModel"

const DataTable = dynamic(() => { return import("vComponents/dist/DataTable") }, { ssr: false })
const DataForm = dynamic(() => { return import("vComponents/dist/DataForm") }, { ssr: false })
const VDialog = dynamic(() => { return import("vComponents/dist/VDialog") }, { ssr: false })
const YesNoQuestion = dynamic(() => { return import("vComponents/dist/YesNoQuestion") }, { ssr: false })
/**
 * 
 * @brief Mantenimiento de la tabla i18n para las etiquetas en las pantallas
 */
const Etiquetas = () => {

  const i18n = useI18n()
  const loading = useLoading()
  const hasMounted = useHasMounted()

  const [headers, setHeaders] = useState(i18nProps()) // {valiable con las propiedades de los campos}
  const [items, setItems] = useState([])
  const [token, setToken] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)
  const [yesNoOpen, setYesNoOpen] = useState(false)
  const [model, setModel] = useState(i18nModel()) // {variable con los campos que mapean los datos en la tabla}
  const sprSelect = 'SPR_I18N_S'
  const sprInsert = 'SPR_I18N_I'
  const sprUpdate = 'SPR_I18N_U'
  const sprDelete = 'SPR_I18N_D'
  const sprListasValores = 'SPR_LISTA_VALORES_S'
  const sprListasValoresConParametros = 'SPR_CATALOGOS_ENTIDAD'
  const formName = 'frmI18n'

  const newItem = (DFDialogTurn = 0) => {
    setIsEdit(false)
    setModel(i18nModel())
    if (DFDialogTurn === 0) {
      setIsOpen(true)
    } else {
      setIsOpen2(true)
    }
  }

  const editItem = (item) => {
    setIsEdit(true)
    setModel(item)
    setIsOpen(true)
  }

  const deleteItem = (item) => {
    setModel(item)
    setYesNoOpen(true)
  }

  const cancelDeleteItem = () => {
    setModel(i18nModel())
    setYesNoOpen(false)
  }

  const saveItem = async (modelSave, saveNew = false) => {
    loading.start()
    const spr = isEdit === true ? sprUpdate : sprInsert
    const resultado = await execute(spr, [
      token,
      /* propiedades según el modelo asociado (spr insert y update deben llevar la misma cantidad y orden de parámetros) */
      modelSave.lenguaje,
      modelSave.id_mensaje,
      modelSave.mensaje, 
      modelSave.id_mensaje_padre
    ])
    loading.stop()
    if (environment.validaResultadoDB(resultado, i18n, toast, true) === true) {
      listar(token)
      if (isOpen === true) {
        setIsOpen(false)
        if (saveNew === true) {
          newItem(1)
        }
      } else {
        setIsOpen2(false)
        if (saveNew === true) {
          newItem(0)
        }
      }
    }
  }

  const doDeleteItem = async (item) => {
    loading.start()
    const resultado = await execute(sprDelete, [
      token,
      item.lenguaje,
      item.id_mensaje
    ])
    loading.stop()
    setYesNoOpen(false)
    if (environment.validaResultadoDB(resultado, i18n, toast, true) === true) {
      listar(token)
    }
  }

  /**
   * @brief obtiene los tipos de clientes desde base de datos
   * @param {*} token valor encriptado que se genera al dar login
   */
  const listar = async (token) => {
    loading.start()
    const response = await execute(sprSelect, [token])
    loading.stop()
    if (environment.validaResultadoDB(response, i18n, toast) === true) {
      setItems(response)
    }
  }



  /**
  * @brief obtiene todas las listas de valores a utilizar en la pantalla desde Base de Datos
  */
  const listarCatalogos = async () => {
    const newHeaders = []
    for (const hds of headers) {
      if (hds.listName && hds.listName.length > 0) {
        const lov = await execute(sprListasValores, [hds.listName])
        if (environment.validaResultadoDB(lov, i18n, toast) === true) {
          hds.list = lov
        }
      }
      newHeaders.push(hds)
    }
    setHeaders(newHeaders)
  }

  /**
   * @brief obtiene todas las listas de valores por compañía o parametros adicionales a utilizar en la pantalla desde Base de Datos
   */
  const listarCatalogosParametros = async (token) => {
    const newHeaders = []
    for (const hds of headers) {
      if (hds.listNameParams && hds.listNameParams.length > 0) {
        let params = []
        if (hds.fixedListParams && Array.isArray(hds.fixedListParams) && hds.fixedListParams.length === 3) {
          params = [token, hds.listNameParams, ...hds.fixedListParams]
        } else {
          params = [token, hds.listNameParams, null, null, null]
        }
        const lov = await execute(sprListasValoresConParametros, params)
        if (environment.validaResultadoDB(lov, i18n, toast) === true) {
          hds.list = lov
        }
      }
      newHeaders.push(hds)
    }
    setHeaders(newHeaders)
  }

  /**
   * 
   * @brief traduce las etiquetas según el lenguaje seleccionaao
   * @brief cambiando el valor de las variables headers
   */
  const i18nHeaders = () => {
    return new Promise((resolve) => {
      const newHeaders = []
      for (const hds of headers) {
        if (hds.i18n && hds.i18n.length > 0) {
          hds.text = i18n.t(hds.i18n)
        }
        if (hds.pristineMessages) {
          Object.keys(hds.pristineMessages).forEach((msg) => {
            if (msg.includes('-params') === false) {
              if (hds.pristineMessages[`${msg}-params`]) {
                hds.inputProps[`data-pristine-${msg}-message`] = i18n.t(hds.pristineMessages[msg], hds.pristineMessages[`${msg}-params`])
              } else {
                hds.inputProps[`data-pristine-${msg}-message`] = i18n.t(hds.pristineMessages[msg])
              }
            }
          })
        }
        newHeaders.push(hds)
      }
      resolve(newHeaders)
    })
  }

  const translateHeaders = async () => {
    const newHeaders = await i18nHeaders()
    setHeaders(newHeaders)
  }

  const onChangeLenguaje = async (val, item) => {
    const newHeaders = headers.slice()
    const idxPadre = findIndex(newHeaders, { value: 'id_mensaje_padre'})
    newHeaders[idxPadre].fixedListParams = [val, null, null]
    setHeaders(newHeaders)
    const env = await environment.getEnvUser()
    listarCatalogosParametros(env.token)
  }

  /**
  * @brief obtiene el token guardado en las cookies del navegador y los datos almacenados en localStorage de la aplicacion
  * @brief inicializa los catalogos y listados
  * @returns si no esta el token redirige a la pantalla de login
  */
  const getEnv = async () => {
    const env = await environment.getEnvUser()
    if (!env || !env.token) {
      toast.error(i18n.t('common.inactiveSession'), presets.toaster)
      return
    }
    setToken(env.token)
    // se envía de parámetro token porque el valor en la variable se actualiza hasta el siguiente ciclo de renderizado
    listar(env.token)
    listarCatalogos()
    listarCatalogosParametros(env.token)
    await translateHeaders()
    const newHeaders = headers.slice()
    const idxLenguaje = findIndex(newHeaders, { value: 'lenguaje' })
    newHeaders[idxLenguaje].onChange = onChangeLenguaje;
    setHeaders(newHeaders)
  }

  /**
   * @brief inicializa los datos de ambiente y el listado desde base de datos
   */
  // when page is mounted
  useEffect(() => {
    if (hasMounted) {
      getEnv()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMounted])

  return (
    <>
      <DataTable
        i18n={i18n}
        headers={headers}
        items={items}
        onNewItem={newItem}
        onEditItem={editItem} 
        onDeleteItem={deleteItem}
        presets={presets}
      />
      {isOpen && isOpen === true && 
      <VDialog
      isOpen={isOpen}
      size='sm'
      className='-translate-x-1/2 bg-black bg-opacity-25'
      >
        <DataForm
        headers={headers}
        model={model}
        i18n={i18n}
        presets={presets}
        name={formName}
        isEdit={isEdit}
        onSave={(newModel, saveNew) => saveItem(newModel, saveNew) } 
        onCancel={() => setIsOpen(false)} 
        />
      </VDialog>
      }

      {isOpen2 && isOpen2 === true && 
      <VDialog
      isOpen={isOpen2}
      size='sm'
      className='-translate-x-1/2 bg-black bg-opacity-25'
      >
        <DataForm
        headers={headers}
        model={model}
        i18n={i18n}
        presets={presets}
        name={formName}
        isEdit={isEdit}
        onSave={(newModel, saveNew) => saveItem(newModel, saveNew) } 
        onCancel={() => setIsOpen2(false)} 
        />
      </VDialog>
      }
      { yesNoOpen === true &&
        <YesNoQuestion  
          title={i18n.t('common.deleteRow')} 
          message={i18n.t('common.deleteConfirm', { label: model.descripcion })} 
          onYes={() => doDeleteItem(model)}
          onNo={() => cancelDeleteItem()}
        />
      }
    </>
  )
}



export default Etiquetas
