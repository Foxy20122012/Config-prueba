'use client'
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import { toast } from "react-toastify"
import md5 from 'js-md5'
import Cookie from 'js-cookie'
import { execute } from "@/helper/clientApi"
import useI18n from '@/hooks/useI18n'
import useLoading from "@/hooks/useLoading"
import functions from 'v-functions'
import FormLogin from '@/components/login/FormLogin'
import presets from "@/utils/globalPresets"
import environment from "@/utils/environment"
import useGlobalContainer from "@/hooks/useGlobalContainer"
import useHasMounted from '@/hooks/useHasMounted'

const LoginPage = () => {
  const global = useGlobalContainer()
//   const router = useRouter()
  const i18n = useI18n()
  const loading = useLoading()
  const hasMounted = useHasMounted()
  const homePath = presets.locations.welcome

  const loginUsuario = async (datos) => {
    loading.start()
    if (datos && datos !== null) {
      const hash = md5.create()
      hash.update(datos.password.trim())
      try {
        const resultado = await execute('SPR_LOGIN_USUARIO', [datos.email.toLowerCase().trim(), hash.hex()])
        loading.stop()
        if (resultado === undefined) {
          toast.error(i18n.t('common.errorApi'), presets.toaster)
          return
        }
        if (resultado[0].status === 'ERROR') {
          toast.error(resultado[0].message, presets.toaster)
        } else if (resultado[0].status === 'WARNING') {
          toast.warning(resultado[0].message, presets.toaster)
        } else if (resultado[0].token) {
          const user = {
            email: resultado[0].correo_electronico,
            nombre_usuario: resultado[0].nombre_completo,
            // img_user: resultado[0].foto,
            token: resultado[0].token,
            es_admin: resultado[0].es_admin,
            compania: resultado[0].nombre_entidad
            // lenguaje: resultado[0].lenguaje,
            // estado: resultado[0].estado
          }
          // $store.commit('setUser', user)
          // $store.commit('setToken', resultado[0].token)
          Cookie.set(`${process.env.idApp}:${process.env.NODE_ENV}`, resultado[0].token)
          functions.setEncodeStorage(`${process.env.idApp}/${process.env.NODE_ENV}`, user)
          toast.success(`Bienvenido ${user.nombre_usuario}`, presets.toaster)
          global.setUserObj(user)
          global.setToken(resultado[0].token)
        //   router.push(homePath)
          
          // $emit('click', resultado[0].token)
          // setTimeout(() => {
          //   if (redirect === true) {
          //     setLocation('/welcome')
          //   }
          // }, 500)
        }
      } catch(error) {
        toast.error(i18n.t('common.errorApi') + error, presets.toaster)
      }
    }
  }

  const getEnv = async () => {
    const env = await environment.getEnvUser()
    if (env && env.token) {
    //   router.push(presets.locations.welcome)
    }
  }

  // when page is mounted
  useEffect(() => {
    if (hasMounted) {
      getEnv()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMounted])

  return (
    <div className={'via-login-page'}>
      <div className={'via-login-layout'}>
        {/* <!-- Tarjeta de Login --> */}
        <div className={'via-card'}>
          <div className={'via-login-header'}>
            <div className={'shrink-0 h-64 w-64'}>
              <Image src={presets.images.logo} alt="logo" className={'via-login-logo'} width={100} height={100} />
            </div>
          </div>
          <div className="flex w-full align-center p-4 ">
            <div className={'via-login-form'}>
              {/* <!-- Formulario --> */}
              <FormLogin onLogin={loginUsuario} />
              {/* <!-- Fin Formulario --> */}
            </div>
          </div>
        </div>
      </div>
      <div
        className={'via-login-background'}
        style={{backgroundImage: `url(${presets.images.loginFondo})`, minHeight: '75vh', backgroundSize: 'cover'}}
      />
    </div>
  )
}

export default LoginPage
