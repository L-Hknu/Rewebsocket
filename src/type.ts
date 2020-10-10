/** 配置 */
interface IConfig {
	/** 数据格式 */
	binaryType:'blob' | 'arraybuffer'
	/** 是否初始化连接 */
  isAutomaticOpen: boolean
  /** 是否开启重连 */
  isReconnect: boolean
	/** 尝试重新连接之前要延迟的毫秒数*/
	reconnectInterval: number
	/** 尝试进行的最大重新连接数。如果为null，则为无限 */
	maxReconnectAttempts: null | number
	/** 是否开启心跳 */
	isHeartbeat:boolean
	/** 心跳间隔默认1分钟 */
	heartbeatInterval: number
}
/** ws 类型 */
interface IMkWebSocketProps {
	/** websocket连接url */
	url: string
	/** 配置 */
	config?: Partial<IConfig>
	/** 子协议 */
	protocols?: any
}
/** 事件池类型 */
interface IEventPool {
    /** 事件名称是字符串就好 */
    type:string
    /** 出发的事件 */
    listener:Function
}
/** class 所有内容 */
//@ts-ignore
interface MkWebSocket {
  /** WebSocket实例 */
	ws: WebSocket
  /**请求的HTTP */
  url:string
  /** 事件池 */
  eventPool:Array<IEventPool> 
  /**配置 */
  config:IConfig
  /** 传递参数 */
  props: IMkWebSocketProps
  /** 心跳计时器 */
  heartbeatTime: any 
  /** 重连计时器 */
  rceconnectTime: any 
  /** 是否是手动关闭 */
  isHandClose : boolean
  /**初始化设置 */
  init: () => void
  /** 设置心跳 */
  setHearBeat: () => void
  /**绑定监听事件 */
  bindEvent: () => void
  /** 重连 */
  reconnect: () => void
  /** 重连计时器 */
  rceconnectInterval:(time:number,reNumber:number) => void
  /** 事件派发 */
  dispatchEvent: (e) => void
  /** 打开ws链接 */
  handOpen: () => void
  /** 关闭链接 */
  handClose: (code?:number,reason?:string) => void
  /** 数据通讯 */
  send : (data) => void
  /** 获取事件池 */
  getEventList : () => Array<IEventPool> 
  /** 获取ws状态 */
  readyState: () => number 
  /** 监听关闭事件 */
  onClose: (e) => void
  /** 监听通知事件 */
  onMessage: (e) => void
  /** 监听打开事件 */
  onOpen: (e) => void
  /** 监听错误 */
  onError: (err) => void
  /** 添加通知事件 */
  addEvent: (type:string,listener:Function) => void
  /** 通知事件 */
  removeEvent: (type:string,listener:Function) => void
  /** 添加分类事件 */
  addModuleEvent: (module:string,type:string,listener:Function) => void
  /** 移除分类事件 */
  removeModuleEvent: (module:string,type:string,listener:Function) => void
}
interface IMkWebSocket {
  /** 打开ws链接 */
  handOpen: () => void
  /** 关闭链接 */
  handClose: (code?:number,reason?:string) => void
  /** 数据通讯 */
  send : (data) => void
  /** 获取事件池 */
  getEventList : () => Array<IEventPool> 
  /** 获取ws状态 */
  readyState: () => number 
  /** 添加通知事件 */
  addEvent: (type:string,listener:Function) => void
  /** 通知事件 */
  removeEvent: (type:string,listener:Function) => void
  /** 添加分类事件 */
  addModuleEvent: (module:string,type:string,listener:Function) => void
  /** 移除分类事件 */
  removeModuleEvent: (module:string,type:string,listener:Function) => void
  /** 手动通知事件更新 */
  handDispatchEvent: (e?:any) => void
  /** 自定义心跳 */
  hearBeat:() => string
  /** 自定义打开通知事件 */
  open: Function
  /** 自定义错误通知事件 */
  error: Function
  /** 自定义关闭通知事件 */
  close: Function
}
export {
	IConfig,
	IMkWebSocketProps,
	IEventPool,
	IMkWebSocket
}
