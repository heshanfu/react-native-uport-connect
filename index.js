import './globals'
require('crypto')

import { Linking } from 'react-native'

import { Connect } from 'uport-connect'
import { Credentials } from 'uport-credentials'
import { transport } from 'uport-transports'

const configureUportConnect = (config) => {

  const callbackUrl = `${config.appUrlScheme}://uport/callback`
  
  const onloadResponse = () => {
    return transport.url.parseResponse('')
  }

  const uportConnect = new Connect(config.appName, {
    isMobile: true,
    onloadResponse,
    useStore: false,
  })
  
  if (config.appAddress && config.privateKey) {
    uportConnect.credentials = new Credentials({
      address: config.appAddress,
      privateKey: config.privateKey
    })
  }

  uportConnect.genCallback = (id) => {
    return `${callbackUrl}%23id=${id}`
  }

  uportConnect.mobileTransport = (message, {id}) => {
    const url = message.indexOf(config.appUrlScheme) !== -1 ? 
      message : `https://id.uport.me/req/${message}?callback_type=redirect&redirect_url=${callbackUrl}%23id=${id}`
    Linking.openURL(url)
  }

  Linking.addEventListener('url', (uri) => {
    uportConnect.pubResponse(
      transport.url.parseResponse(uri.url)
    )
  })

  return uportConnect
}

export default configureUportConnect
