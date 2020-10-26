import {IConfig, IShareWebSocketProps,IEventPool , IShareWebSocket } from './type'
import { setWslocalStorage } from './share'
/**默认配置 */
const initConfig: IConfig = {
  isReconnect:true,
  binaryType: 'blob' ,
  isAutomaticOpen: true,
  reconnectInterval: 1000,
  maxReconnectAttempts: 5 ,
  isHeartbeat: true,
  heartbeatInterval: 30000,
}
export default class ShareWebSocket implements IShareWebSocket   {
  /**  web */
  private ws: WebSocket
  /**请求的HTTP */
  url:string
  /** 事件池 */
  private eventPool:Array<IEventPool> = []
  /** 自定义事件池 提供给外部分类 根据监听事件触发对应信息*/
  moduleEventPool:{
    [k:string]:Array<IEventPool>
  } = {}
  /**配置 */
  private config:IConfig = initConfig
  private props: IShareWebSocketProps
  /** 心跳计时器 */
  private heartbeatTime: any = null
  private rceconnectTime: any = null
  /** 是否是手动关闭 */
  private isHandClose = false
  /** 是否在尝试重连 */
  private isReConncetState = false
  constructor (props:IShareWebSocketProps) {
    this.props = props
    this.init()
  }
  /**初始化 */
  private init () {
    this.initConfig()
    if(this.config.isAutomaticOpen){
      this.handOpen()
    }
  }
  /** 心跳 */
  private setHearBeat (){
    const {isHeartbeat, heartbeatInterval} = this.config
    if(!this.heartbeatTime&&isHeartbeat){
      this.heartbeatTime = setInterval(()=>{
        this.ws.send(this.hearBeat())
      },heartbeatInterval)
    }
  }
  /**绑定监听事件 */
  private bindEvent (){
    this.ws.addEventListener('open',this.onOpen.bind(this))
    this.ws.addEventListener('close',this.onClose.bind(this))
    this.ws.addEventListener('error',this.onError.bind(this))
    this.ws.addEventListener('message',this.onMessage.bind(this))
  }
  /** 更新配置 */
  private initConfig (){
    const { config = {} } = this.props  
    for (const key in this.config) {
      if (config.hasOwnProperty(key)) {
        this.config[key] = config[key]
      }
    }
  }
  /** 重连 */
  private reconnect (){
    if(this.isHandClose||this.isReConncetState) return
    this.isReConncetState=true
    const retime = this.config.reconnectInterval
    const reNumber = 0
    this.rceconnectInterval(retime,reNumber)
  }
  /** 重连计时器 */
  private rceconnectInterval (time:number,reNumber:number){
    this.rceconnectTime&&clearTimeout(this.rceconnectTime)
    this.rceconnectTime=setTimeout(()=>{
      console.log(`ws连接失败尝试重连中:第${reNumber}次`)
      reNumber++
      if(this.config.maxReconnectAttempts&&reNumber> this.config.maxReconnectAttempts) return
      // 每次计时翻倍
      time=time*2
      this.handOpen()
      this.rceconnectInterval(time,reNumber)
    },time)
  }
  /** 连接关闭 */
  private onClose (e) {
    this.close(e)
    this.config.isReconnect&&this.reconnect()
    this.ws.removeEventListener('open',this.onOpen.bind(this))
    this.ws.removeEventListener('error',this.onError.bind(this))
    this.ws.removeEventListener('message',this.onMessage.bind(this))
    this.ws.removeEventListener('close',this.onClose.bind(this))
    this.heartbeatTime&&clearInterval(this.heartbeatTime)
  }
  /** 通知事件不提供给外部使用*/
  private onMessage (res) {
    setWslocalStorage()
    const data =  JSON.parse(res.data)
    this.dispatchEvent(data)    
  }
  /**事件派发 */
  private dispatchEvent (e:any,moduleName?:string){
    let counter = 0
    if(!moduleName){
      while (counter<this.eventPool.length) {
        this.eventPool[counter].listener(e)
        counter++
      }
    }else{
      if(!this.moduleEventPool[moduleName]) return
      while (counter<this.moduleEventPool[moduleName].length) {
        this.moduleEventPool[moduleName][counter].listener(e)
        counter++
      }
    }
  }
  /** 手动通知事件更新 */
  handDispatchEvent (e) {
    this.dispatchEvent(e)
  }
  /** 打开链接 */
  handOpen (){
    this.rceconnectTime&&clearTimeout(this.rceconnectTime)
    const {url,protocols } =this.props
    this.ws=new WebSocket(url,protocols)
    this.ws.binaryType=this.config.binaryType
    this.bindEvent()
  }
  /** 关闭链接 */
  handClose (code?:number,reason?:string) {
    this.ws.close(code,reason)
    this.heartbeatTime&&clearInterval(this.heartbeatTime)
    this.isHandClose = true
  }
  /** 数据通讯 */
  send (data){
    this.ws.send(data)
  }
  /** 获取事件池 */
  getEventList ( moduleName?:string ){
    if(!moduleName){
      return this.eventPool
    }else{
      return this.moduleEventPool[moduleName]
    }

  }
  /** 获取ws状态 */
  readyState (){
    console.log(this.ws)
    if(!this.ws||this.ws.readyState){
      return 0
    }
    return this.ws.readyState
  }
  /**handDispatchEvent */
  handModuleDispatchEvent (module:string,e){
    if(!module) return
    this.dispatchEvent(e,module)
  }
  /** 添加到分类事件中 */
  addModuleEvent (module:string,type:string,listener:Function){
    if(!listener){
      console.error('listenercallback is null')
      return
    }
    if(!this.moduleEventPool[module]){
      this.moduleEventPool[module] = []
    }
    this.moduleEventPool[module].push({
      type,listener
    })
  }
  /** 移除分类事件 */
  removeModuleEvent (module:string,type:string,listener:Function){
    if(!this.moduleEventPool[module]||this.moduleEventPool[module].length) return
    let counter = 0
    while (counter<this.moduleEventPool[module].length) {
      const eventListener = this.moduleEventPool[module][counter]
      if(eventListener.type===type&&eventListener.listener===listener){
        this.moduleEventPool[module].splice(counter,1)
      }
      counter++
    }
  }
  /**添加监听 */
  addEvent (type:string,listener:Function){
    if(!listener){
      console.error('listenercallback is null')
      return
    }
    this.eventPool.push({
      type,listener
    })
  }
  /**移除监听 */
  removeEvent (type:string,listener:Function){
    let counter = 0
    while (counter<this.eventPool.length) {
      const eventListener = this.eventPool[counter]
      if(eventListener.type===type&&eventListener.listener===listener){
        this.eventPool.splice(counter,1)
      }
      counter++
    }
  }
  /** 打开时 */
  private onOpen (e){
    this.rceconnectTime&&clearTimeout(this.rceconnectTime)
    this.isReConncetState = false
    this.open(e)
    this.setHearBeat()
  }
  /** 错误提示 */
  private onError (err) {
    this.error(err)
  }
  //一下事件提供给外部可以重写
  /** 打开连接后通知事件 */
  open (e){
    console.log('WebSocket已连接:',e.type)
  }
  error (err){
    console.log('WebSocketError:',err.type)
  }
  close (e) {
    console.log('WebSocketcloseNotice:',e.type)
  }
  hearBeat (){
    return JSON.stringify({data:'hearBeat'})
  }
} 
