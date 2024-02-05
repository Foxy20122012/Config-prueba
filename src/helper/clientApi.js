import getConfig from 'next/config';
import forge from 'node-forge';

const { publicRuntimeConfig } = getConfig();

const constants = {
  urlWebApi: process.env.NEXT_PUBLIC_urlWebApi,
  urlUploadApi: process.env.NEXT_PUBLIC_urlUploadApi,
  publicKey: process.env.NEXT_PUBLIC_publicKey
};

const uris = {
  procedure: '',
  upload: '/upload',
};

const encryptRsa = function (obj) {
  const encoded = forge.util.encodeUtf8(obj);
  const publicKey = forge.pki.publicKeyFromPem(constants.publicKey);
  const encrypted = publicKey.encrypt(encoded, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: forge.mgf1.create(),
  });
  const base64 = forge.util.encode64(encrypted);
  return base64;
};

const callWs = async (uri, json) => {
  try {
    const response = await fetch(uri, {
      body: JSON.stringify(json),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Error en la llamada a la API: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data; // return data rows
  } catch (error) {
    console.error('Error en la llamada a la API:', error);
    throw error;
  }
};

const execute = async (spName, params, encriptado = 0, loading = false, connInfo = undefined) => {
  let model = {};
  if (typeof spName === 'string') {
    model.nombre = spName;
    model.loading = loading;
    model.parametros = params ?? [];
    if (encriptado === 1) {
      const paramsToEncrypt = {
        nombre: spName,
        parametros: params,
      };
      const paramsEncryptedString = encryptRsa(JSON.stringify(paramsToEncrypt));

      model.nombre = '';
      model.encriptado = 1;
      model.parametros = paramsEncryptedString;
    }
  } else if (typeof spName === 'object') {
    if (encriptado === 1) {
      const paramsEncryptedString = encryptRsa(JSON.stringify(spName));
      model.parametros = paramsEncryptedString;
      model.encriptado = 1;
      model.loading = loading;
    } else {
      model = spName;
      model.loading = loading;
    }
  }

  try {
    if (connInfo) {
      return await callWs(
        connInfo.api + '/' + connInfo.env + '/' + connInfo.exposeRoute + '?apikey=' + connInfo.apikey,
        model
      );
    }
    return await callWs(constants.urlWebApi + uris.procedure, model);
  } catch (error) {
    console.error('Error en la función execute:', error);
    throw error;
  }
};

export { execute };
