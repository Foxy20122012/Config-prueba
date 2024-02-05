import { createContext, useState, useRef, useEffect } from 'react'
import rosetta from 'rosetta'
// import rosetta from 'rosetta/debug'
import { execute } from '@/helper/clientApi'
import useHasMounted from '../hooks/useHasMounted'

const i18n = rosetta()

export const defaultLanguage = 'es'
export const languages = ['es', 'en']
export const contentLanguageMap = { es: 'es-GT', en: 'en-US' }

export const I18nContext = createContext()

// default language
i18n.locale(defaultLanguage)

const I18nProvider = ({ children, locale, dict }) => {
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
    // si la app ya esta renderizada se cargan los textos
    if (hasMounted) {
      const i18nDb = await execute('SPR_I18N_S', [locale])
      msgs = i18nDb.reduce((obj, elm) => {
        obj[elm.id_mensaje_padre] = { ...obj[elm.id_mensaje_padre], [elm.id_mensaje]: elm.mensaje }
        return obj
      }, {})
    }
    i18nWrapper.locale(locale, msgs)
    setLangIsLoaded(true)
  }

  // for initial SSR render
  if (locale && firstRender.current === true) {
    firstRender.current = false
    setLanguage()
  }

  // when locale is updated
  useEffect(() => {
    if (locale) {
      setLanguage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])
  
  // when page is mounted
  useEffect(() => {
    if (hasMounted) {
      setLanguage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMounted])

  return (
    <I18nContext.Provider value={i18nWrapper}>{children}</I18nContext.Provider>
  )
}

export default I18nProvider
