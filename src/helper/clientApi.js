import forge from 'node-forge'

const constants = {
  urlWebApi: process.env.urlWebApi,
}

const uris = {
  procedure: '',
  upload: '/upload'
}

const encryptRsa = function (obj) {
  const encoded = forge.util.encodeUtf8(obj)
  const publicKey = forge.pki.publicKeyFromPem(constants.publicKey)
  const encrypted = publicKey.encrypt(encoded, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: forge.mgf1.create()
  })
  const base64 = forge.util.encode64(encrypted)
  return base64
}

const callWs = async (uri, json) => {
  const response = await fetch(uri, {
    body: JSON.stringify(json),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  const result = await response.json()
  return result.data
}

const execute = async (spName, params) => {
  let model = {}
  
  if (typeof spName === 'string') {
    model.nombre = spName
    model.parametros = params ?? []
  } else if (typeof spName === 'object') {
    model = spName
    model.parametros = params ?? []
  }

  return await callWs(constants.urlWebApi + uris.procedure, model)
}

export { execute }
