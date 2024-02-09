import { createContext, useState, useRef, useEffect } from 'react'
import rosetta from 'rosetta'
import useHasMounted from '../hooks/useHasMounted'

const i18n = rosetta()

export const defaultLanguage = 'es'
export const languages = ['es', 'en']

export const I18nContext = createContext()

// default language
i18n.locale(defaultLanguage)

const I18nProvider = ({ children, locale }) => {
  const activeLocaleRef = useRef(locale || defaultLanguage)
  const [, setTick] = useState(0)
  const firstRender = useRef(true)
  const [langIsLoaded, setLangIsLoaded] = useState(false)
  const hasMounted = useHasMounted()

  const i18nWrapper = {
    activeLocale: activeLocaleRef.current,
    langIsLoaded: langIsLoaded,
    t: (...args) => i18n.t(...args),
    locale: (l, dict) => {
      i18n.locale(l)
      activeLocaleRef.current = l
      if (dict) {
        i18n.set(l, dict)
      }
      // force rerender to update view
      setTick((tick) => tick + 1)
    },
  }

  const setLanguage = async () => {
    let msgs = {}
    // Si la app ya está renderizada, se cargan los textos
    if (hasMounted) {
      try {
        const response = await fetch("https://apisuite.azurewebsites.net/api/data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spName: "SPR_I18N_S",
            params: [activeLocaleRef.current],
          }),
        });

        if (!response.ok) {
          throw new Error(`Error al llamar a la API: ${response.statusText}`);
        }

        const result = await response.json();
        if (result && Array.isArray(result.data)) {
          msgs = result.data.reduce((obj, elm) => {
            obj[elm.id_mensaje_padre] = { ...obj[elm.id_mensaje_padre], [elm.id_mensaje]: elm.mensaje }
            return obj
          }, {})
        } else {
          console.error("Error al obtener mensajes desde la API");
        }
      } catch (error) {
        console.error("Error en la llamada a la API:", error);
      }
    }
    i18nWrapper.locale(activeLocaleRef.current, msgs)
    setLangIsLoaded(true)
  }

  // For initial SSR render
  if (locale && firstRender.current === true) {
    firstRender.current = false
    setLanguage()
  }

  // When locale is updated
  useEffect(() => {
    if (locale) {
      setLanguage()
    }
  }, [locale])
  
  // When page is mounted
  useEffect(() => {
    if (hasMounted) {
      setLanguage()
    }
  }, [hasMounted])

  return (
    <I18nContext.Provider value={i18nWrapper}>{children}</I18nContext.Provider>
  )
}

export default I18nProvider
