import React, { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, ArrowLeftOnRectangleIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/20/solid'
import * as iconsFc from 'react-icons/fc'
import * as iconsMd from 'react-icons/md'
import * as HeroIcons from '@heroicons/react/24/solid'
import mq from 'js-mq'

import PropTypes from 'prop-types'

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool,
  setSidebarOpen: PropTypes.func,
  menu: PropTypes.array,
  sidebarStyles: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  optionStyles: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  iconOptionStyles: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  suboptionStyles: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  iconSuboptionStyles: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onClickLogout: PropTypes.func,
  presets: PropTypes.object,
  appTitleStyles: PropTypes.string,
  userInfoStyles: PropTypes.string
}

// funcion que agrupa un vector de objetos por un campo y lo convierte en arbol
const nest = (items, idMenu = null, link = 'id_menu_padre') =>
  items
    .filter(item => item[link] === idMenu)
    .map(item => ({
      ...item,
      children:
          nest(items, item.id_menu).length <= 0
            ? undefined
            : nest(items, item.id_menu)
    }))

const fontSizeClass = ' xs:text-md sm:text-md md:text-md lg:text-base xl:text-base '

// From https://reactjs.org/docs/hooks-state.html
export default function Sidebar ({ sidebarOpen, setSidebarOpen = () => {}, menu, sidebarStyles, optionStyles = fontSizeClass, iconOptionStyles, suboptionStyles = fontSizeClass, iconSuboptionStyles, onClickLogout, presets, appTitleStyles = '', userInfoStyles = fontSizeClass }) {
  const trigger = useRef(null)
  const sidebar = useRef(null)
  const [options, setOptions] = useState([])
  const [isMobile, setIsMobile] = useState(false)

  const getFontSize = (base) => {
    if (base != null &&
        (base.includes('text-xs') || base.includes('text-sm') || base.includes('text-base') || base.includes('text-md') || base.includes('text-lg') || base.includes('text-xl'))) {
      return ''
    }
    return fontSizeClass
  }

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return
      setSidebarOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  useEffect(() => {
    const menus = nest(menu)
    setOptions(menus)
  }, [menu])

  useEffect(() => {
    registrarBreckpoint()
  }, [])
  
  const registrarBreckpoint = () => {
    if (typeof document !== undefined) {
      try {
        mq.register([
          { name: 'mobile', query: '(max-width: 767px)' },
          { name: 'desktop', query: '(min-width: 768px)' }
        ])
        mq.on('mobile', (e) => {
          setIsMobile(true)
        })
        mq.on('desktop', (e) => {
          setIsMobile(false)
        })
        const arrayEstadoMq = mq.getState()
        if (arrayEstadoMq.length && (arrayEstadoMq[0] === 'not-mobile' || arrayEstadoMq[0] === 'desktop')) {
          setIsMobile(false)
        } else {
          setIsMobile(true)
        }
      } catch (e) {
        console.error(`Error al registrar mq breackpoints - ${e.message}`)
      }
    }
  }

  const getSidebarClass = () => {
    let resultCss = ''
    if (isMobile === true) {
      resultCss = `flex flex-col z-60 top-1/3 h-4/6 overflow-y-auto w-full  shrink-0 p-4 rounded-md duration-[400ms] ease-in-out
        ${sidebarOpen ? 'translate-y-0 fixed' : '  transform translate-y-[100vh] fixed'} `
    } else {
      resultCss = `flex flex-col z-40 left-0 top-0 h-screen overflow-y-auto w-64  shrink-0 p-4 transition-all duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0 relative' : '-translate-x-64 absolute'} `
    }
    return resultCss
  }

  const setSelected = (option) => {
    const menus = options.slice()
    const idx = menus.indexOf(option)
    option.isSelected = option.isSelected ? !option.isSelected : true
    menus.splice(idx, 1, option)
    setOptions(menus)
    if (option.path && option.path !== null) {
      setSidebarOpen(false)
    }
  }

  const setSelectedSubOption = (option, suboption) => {
    setSidebarOpen(false)
  }

  const SubMenuOption = ({ option }) => {
    if (option.children && option.children.length > 0 && option.isSelected === true) {
      return (
        <ul id='dropdown-example' className='ml-1 py-1 space-y-1'>
          {option.children.map((suboption) => {
            if (suboption.type === 'divisor') {
              return (<li key={suboption.id_menu}><hr /></li>)
            }
            return null
          })}
        </ul>
      )
    }
    return null
  }

  const MenuOption = ({ option }) => {
    const getIcono = (item) => {
      try {
        const IconComponent = HeroIcons[item.icon]
        if (IconComponent != null) {
          return IconComponent
        }
        const IconComponentMd = iconsMd[item.icon]
        if (IconComponentMd != null) {
          return IconComponentMd
        }
        const IconComponentFC = iconsFc[item.icon]
        if (IconComponentFC != null) {
          return IconComponentFC
        }
        return null
      } catch (e) {
        return null
      }
    }
    let Icono = null
    if (option.icon) {
      Icono = getIcono(option)
    }
    if (option.type === 'titulo') {
      return (
        <>
          <button
            type='button'
            className={`flex items-center p-2 w-full rounded-lg transition duration-75 group ${Array.isArray(optionStyles) ? optionStyles.join(' ') : optionStyles} ${getFontSize(optionStyles)}`}
            aria-controls='dropdown-example' data-collapse-toggle='dropdown-example'
            title={option.title}
          >
            <div className='flex-1 ml-3 text-left whitespace-nowrap truncate text-ellipsis'>{option.title}</div>
            {Icono && <Icono className={`h-7 w-7 text-white fill-current ${Array.isArray(iconOptionStyles) ? iconOptionStyles.join(' ') : iconOptionStyles}`} />}
          </button>
        </>
      )
    }
    return (
      <>
        <button
          type='button'
          className={`flex items-center p-2 w-full rounded-lg transition duration-75 group ${Array.isArray(optionStyles) ? optionStyles.join(' ') : optionStyles}  ${getFontSize(optionStyles)}`}
          aria-controls='dropdown-example' data-collapse-toggle='dropdown-example'
          title={option.title}
          onClick={() => setSelected(option)}
        >

          {Icono && <Icono className={`h-7 w-7 text-white fill-current ${Array.isArray(iconOptionStyles) ? iconOptionStyles.join(' ') : iconOptionStyles}`} />}

          <div className='flex-1 ml-3 text-left whitespace-nowrap truncate text-ellipsis'>{option.title}</div>
          {option.children && option.children.length > 0 && <ChevronDownIcon className='h-6 w-6' />}
        </button>
        <SubMenuOption option={option} />
      </>
    )
  }

  // Datos de usuario
  const userObj = {
    compania: 'Nombre de la Compañía',
    nombre_usuario: 'Nombre del Usuario',
    email: 'correo@example.com'
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-opacity-30 z-40 md:hidden md:z-auto transition-opacity duration-200 
        ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${Array.isArray(sidebarStyles) ? sidebarStyles.join(' ') : sidebarStyles}`}
        aria-hidden='true'
        onClick={() => {setSidebarOpen(!sidebarOpen)}}
      />
      <div
        id='sidebar'
        ref={sidebar}
        className={` ${ getSidebarClass() } ${Array.isArray(sidebarStyles) ? sidebarStyles.join(' ') : sidebarStyles}`}
      >
        <div className='pt-0 justify-end md:hidden fixed top-4 right-6 '>
          <div className='px-3 py-2'>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              <div className='sr-only'>Expand / collapse sidebar</div>
              <XMarkIcon className={`w-6 h-6 bg-white bg-opacity-50 rounded-md text-${presets.theme}-600`} />
            </button>
          </div>
        </div>
        <div className='flex justify-between mb-10 pr-3 sm:px-2'>
          <div className='flex gap-x-2 items-center' title='Versión 3.0.10'>
            <img
              src={presets.images.icon}
              className={`w-12 h-12 cursor-pointer duration-500 ${
                sidebarOpen && 'rotate-[360deg]'
              }`}
              alt={presets.appTitle}
              width={100}
              height={100}
            />
            <h1 className={`text-white origin-left font-medium text-xl duration-200 ${!sidebarOpen && 'scale-0'} ${appTitleStyles} `}>
              {presets.appTitle}
            </h1>
          </div>
        </div>
        <div className={` flex w-full flex-col space-y-0  border-b-2 border-gray-300 text-gray-50 ${userInfoStyles} ${getFontSize(userInfoStyles)}`}>
          <div className='px-2 font-medium '> {userObj ? userObj.compania : ''} </div>
          <div className='px-2'>{userObj ? userObj.nombre_usuario : ''}</div>
          <div className='px-2 break-all '>{userObj ? userObj.email : ''}</div>
        </div>
        <div className={`overflow-y-auto py-4 px-2 my-0 rounded ${Array.isArray(sidebarStyles) ? sidebarStyles.join(' ') : sidebarStyles}`}>
          <ul className='space-y-2'>
            {options.map((option) => (
              <li key={option.id_menu + '_li'}>
                {option.type === 'divisor' && <hr key={option.id_menu} />}
                {option.type !== 'divisor' && <MenuOption option={option} key={option.id_menu} />}
              </li>
            ))}
            <hr />
            <li>
              <button
                type='button'
                className={`flex items-center p-2 w-full rounded-lg transition duration-75 group ${Array.isArray(optionStyles) ? optionStyles.join(' ') : optionStyles} ${getFontSize(optionStyles)}`}
                aria-controls='dropdown-example' data-collapse-toggle='dropdown-example'
                onClick={() => onClickLogout()}
              >
                <ArrowLeftOnRectangleIcon className='h-6 w-6 pr-2' />
                <div className='flex-1 ml-3 text-left whitespace-nowrap'>logout</div>
              </button>
            </li>
          </ul>
        </div>
      </div>
      { isMobile === true && 
        <div className="fixed z-60 right-3 bottom-3" v-if="isMobile" >
          <button
            id="vtDrawerButton"
            className={`bg-${presets.theme}-600  hover:bg-${presets.theme}-700 flex items-center justify-between px-2 py-2 font-normal leading-5 text-white transition-colors duration-150  border border-transparent rounded-lg active:bg-purple-600  focus:outline-none focus:shadow-outline-purple `}
            aria-label="Like"
            onClick={() => {setSidebarOpen(!sidebarOpen)}}
          >
            <Bars3Icon className='h-6 w-6' />
          </button>
        </div>
      }
    </>
  )
}
