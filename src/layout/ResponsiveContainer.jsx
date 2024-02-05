import { useEffect, useState, createContext } from 'react'
import { useRouter } from 'next/router'
import { execute } from "../helper/clientApi"
import environment from '../utils/environment'
import presets from '../utils/globalPresets'
import dynamic from 'next/dynamic'
import useLoading from '../hooks/useLoading'
import useHasMounted from '../hooks/useHasMounted'
import useI18n from '../hooks/useI18n'

export const LayoutContext = createContext()

const Footer = dynamic(() => { return import("vComponents/dist/Footer") }, { ssr: false })
const Navbar = dynamic(() => { return import("vComponents/dist/Navbar") }, { ssr: false })
const Sidebar = dynamic(() => { return import("vComponents/dist/Sidebar") }, { ssr: false })

const ResponsiveContainer = ({ children }) => {
  const router = useRouter()
  const loading = useLoading()
  const i18n = useI18n()
  const hasMounted = useHasMounted()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [menu, setMenu] = useState([])
  const [title, setTitle] = useState('')
  const [userObj, setUserObj] = useState()
  const [token, setToken] = useState('')
  
  const doLogout = async () => {
    const redirectPath = await environment.logout()
    setUserObj(null)
    router.push(redirectPath)
  }

  const onBackKeyDown = () =>{
    if (router.asPath === '/') {
      // cuando esta en la pagina principal cierra la app
      if (navigator.app) {
        navigator.app.exitApp()
      } else if (navigator.device) {
        navigator.device.exitApp()
      } else {
        window.close()
      }
    } else {
      window.history.back()
    }
  }



  const validaPermisosRuta = async (token) => {
    if (router.pathname.includes('/admin')) {
      loading.start()
      const tienePermiso = await environment.validaPermisos(token, 'S', 'N', 'N', 'N')
      loading.stop()
      if (tienePermiso === false) {
        router.push(presets.locations.welcome)
      }
    }
    if (router.pathname.includes('/mantenimientos')) {
      loading.start()
      const tienePermiso = await environment.validaPermisos(token, 'N', 'S', 'N', 'N')
      loading.stop()
      if (tienePermiso === false) {
        router.push(presets.locations.welcome)
      }
    }
  }

  const getMenu = async (token) => {
    loading.start()
    setMenu([])
    if (token && token !== null) {
      console.log('Responsive Container - getMenu - token', token)
      let options = await execute('SPR_MENU_S', [token, 'SC', null])
      setMenu(options)
      console.log('Responsive Container - getMenu - options', options)
      if (environment.validaResultadoDB(options) === false) {
        options = await execute('SPR_MENU_S', [token, 'SC', null])
        setMenu(options)
        console.log('Responsive Container - getMenu - reoptions', options)
      }
    }
    loading.stop()
  }

  const getEnv = async () => {
    try {
      const env = await environment.getEnvUser()
      if (!env || !env.token) {
        toast.error(i18n.t('common.inactiveSession'), presets.toaster)
        router.push(presets.locations.login)
        return  
      }
      setUserObj(env.user)
      setToken(env.token)
      validaPermisosRuta(env.token)
      getMenu(token)
    } catch (error) {
      router.push(presets.locations.login)
    }
  }

  const containerWrapper = {
    userObj: userObj,
    setUserObj: setUserObj,
    token: token,
    setToken: setToken
  }

  useEffect(() => {
    console.log('Responsive Container - getMenu - useEffect token', token)
    getMenu(token)
  }, [token])

  
  // when page is mounted
  useEffect(() => {
    if (hasMounted) {
      getEnv()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMounted])

  useEffect(() => {
    if (process.browser && window.cordova) {
      document.addEventListener("backbutton", onBackKeyDown, false)
    }
  })
  

  return (
    <LayoutContext.Provider value={containerWrapper}>
      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar */}
        {
          userObj && userObj.nombre_usuario &&

          <Sidebar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
            menu={menu} 
            sidebarStyles={'via-bg-sidebar'} 
            optionStyles={'text-base font-normal via-options-sidebar'} 
            suboptionStyles={'text-sm font-normal via-suboptions-sidebar'} 
            onClickLogout={() => doLogout()}
            setTitle={setTitle}
            userObj={userObj}
            environment={environment}
            presets={presets}
            router={router}
            i18n={i18n}
          />
        }

        {/* Content area */}
        <div className={`${sidebarOpen ? 'relative' : 'absolute'} flex flex-col flex-1 overflow-y-auto overflow-x-hidden w-full`}>
          
          {/*  Site header */}
          {userObj && userObj.nombre_usuario &&
          
            <Navbar 
              sidebarOpen={sidebarOpen} 
              setSidebarOpen={setSidebarOpen}
              navbarStyles="border-b via-navbar" 
              menuButtonStyles="via-menu-btn-navbar"
              userMenuButtonStyles="via-usermenu-btn-navbar"
              userOptionStyles="via-useroptions-navbar"
              userOptionSelectedStyles="via-useroptions-selected-navbar"
              onClickLogout={() => doLogout()}
              onClickProfile={() => router.push(`${presets.locations.profile}`)}
              title={title}
              userObj={userObj}
              router={router}
              presets={presets}
              />
          }

          
          <main>
            <div className={userObj && userObj.nombre_usuario ? "px-4 sm:px-6 lg:px-8 py-2 w-full max-w-9xl mx-auto bg-gray-100  mb-10" : ''}>
              {children}
            </div>
          </main>
        </div>
        
      </div>
      <Footer />
    </LayoutContext.Provider>
  )
}

export default ResponsiveContainer
