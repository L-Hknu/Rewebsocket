
import ShareWebSocket from './share-websocket'
import { setWslocalStorage,isStartWs } from './share'
import { WS_NAME } from './constant'
class Notfiy extends ShareWebSocket{
  constructor (url,config?){
    super({url,config})
  }
}
const SYS_IM_URL = '/data/im/webSocket'
/** 创建websoket */

export  function createWebScoket () {
  const  host = location.host,
    protocol = location.protocol === 'http:'?'ws://':'wss://'
    const WS_URL=protocol+host+SYS_IM_URL
    const webSocketNotfiy = new Notfiy(WS_URL,{
    isAutomaticOpen:false,
    isReconnect:false
  })
  return webSocketNotfiy
}
/** 处理webscoket事件挂载 */
export default function openWebScoket (){
  // 挂载门户时 开始创建webScoket
  window[WS_NAME] = createWebScoket()
  window[WS_NAME].addEvent('Notify',(res)=>{
    window[WS_NAME].handModuleDispatchEvent('notify',res)
    setWslocalStorage()
  })
  isStartWs()
}
/** 启动ws */

