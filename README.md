# share-websocket
## 基础版本简介
    在websocket的基础上实现了心跳,重连,共享,事件池共享,可以满足同一个浏览器多页签多浏览器使用一个链接的功能,以此来降低服务器连接数量
    |基础功能|文件|
####IShareWebSocket
|方法|类型|说明|
| ------------- | ------------- | ------------- |
|handOpen| () => void|打开ws链接|
|handClose| (code?:number,reason?:string) => void|关闭链接|
|send| (data)() => void|数据通讯|
|getEventList| () => Array<IEventPool> |获取事件池|
|readyState| () => number|获取ws状态|
|addEvent| (type:string,listener:Function) => void|添加通知事件|
|removeEvent| (type:string,listener:Function) => void|移除通知事件|
|addModuleEvent| (module:string,type:string,listener:Function) => void|添加分类事件|
|removeModuleEvent| (module:string,type:string,listener:Function) => void|移除分类事件|
|handDispatchEvent| (e?:any) => void|手动通知事件更新|
|hearBeat| () => string|自定义心跳|
|open| Function|自定义打开通知事件|
|error| Function|自定义错误通知事件|
|close| Function|自定义关闭通知事件|

