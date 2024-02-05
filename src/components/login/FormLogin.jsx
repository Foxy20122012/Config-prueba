import Pristine from "pristinejs"
import { useEffect, useState } from "react"
import { UserIcon, EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/solid'
import functions from 'v-functions'
import useI18n from "@/hooks/useI18n"
import presets from "@/utils/globalPresets"
import useHasMounted from '@/hooks/useHasMounted'

let validateLogin = null

const FormLogin = ({ onLogin }) => {
  const i18n = useI18n()
  const hasMounted = useHasMounted()
  const [viewPassword, setViewPassword] = useState(false)
  const [isInputValid, setIsInputValid] = useState(false)

  const validate = (event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (validateLogin && validateLogin !== null) {
      const resulValidate = validateLogin.validate()
      setIsInputValid(resulValidate)
    }
  }

  const doLogin = (event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (isInputValid === true) {
      const emailLogin = document.getElementById('usuario')
      const passwordLogin = document.getElementById('clave')
      const datos = {
        email: functions.toUpperCaseAndTrim(emailLogin.value),
        password: functions.trim(passwordLogin.value)
      }
      setIsInputValid(false) // para prevenir doble click
      onLogin(datos)
    }
  }

  // when page is mounted
  useEffect(() => {
    if (hasMounted) {
      const helem = document.getElementById("frmLogin")
      validateLogin = new Pristine(helem, presets.pristine, false)
      // setInitialRender(true)
      const helemUsuario = document.getElementById('usuario')
      helemUsuario.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMounted])
  
  return (
    <form id="frmLogin" name="frmLogin" method="post" onSubmit={(event) => doLogin(event)} noValidate >
      <div className="w-full flex flex-col  px-4 space-y-4  ">
        <div className="form-group  flex flex-col">
          <div className={'via-label'}>
            { ('login.user') }
            <div className="inline-flex text-red-500 font-semibold">(*)</div>
          </div>
          <div className="w-full relative">
            <input
              id="usuario"
              name="usuario"
              required
              placeholder=" "
              type="email"
              data-pristine-required-message={('login.validacion_correo')}
              className={'via-input'}
              onKeyDown={(e) => {e.key === 'Enter' ? validate(e) : () => {}}}
              onChange={(e) => {validate(e)}}
            />
            {/*data-pristine-email-message={i18n.t('login.validacion_correo')}
               <input type="search" id="search-dropdown"  placeholder="Search" required /> */}
            <button 
              className={'via-append-input'}
              onClick={(e) => { e.stopPropagation() }}
              disabled
            >
              <UserIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="form-group  flex flex-col">
          <div className={'via-label'}>
            { ('login.password') }
            <div className="inline-flex text-red-500 font-semibold">(*)</div>
          </div>
          <div className="w-full relative">
            <input
              id="clave"
              name="clave"
              required
              placeholder=" "
              type={viewPassword === false ? 'password' : 'text'}
              data-pristine-required-message={('login.validacion_password')}
              className={'via-input'}
              onKeyDown={(e) => {e.key === 'Enter' ? validate(e) : () => {}}}
              onChange={(e) => {validate(e)}}
            />
            {/* <input type="search" id="search-dropdown"  placeholder="Search" required /> */}
            <button 
              className={'via-append-input'}
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); setViewPassword(!viewPassword) }}
            >
              { viewPassword === false && <EyeIcon className="w-5 h-5" /> }
              { viewPassword == true && <EyeSlashIcon className="w-5 h-5" /> }
            </button>
          </div>
        </div>
        <div className={'via-div-actions'}>
          <button
            type="submit"
            disabled={!isInputValid}
            className={`${'via-button'} ${(isInputValid ? 'bg-red-500' : 'bg-gray-900' )} w-full justify-center mx-0`}
          >
            <KeyIcon className="h-5 w-5 pr-2" />
            { ('login.connect') }
          </button>
        </div>
      </div>
    </form>
  )
}

export default FormLogin
