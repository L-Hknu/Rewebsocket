import {
  SHARE_NAME,
  WS_LOCALSTORAGE_NAME,
  WS_NAME,SHARE_PAGE_ID
} from './constant'
/** 监听综合处理 */
function onwsStorage (callback:Function){
  window.addEventListener('storage',(e:StorageEvent )=>{
    if(e.key===WS_LOCALSTORAGE_NAME){
      callback(e)
    }
    if(e.key===SHARE_NAME&&e.newValue!.length<e.oldValue!.length&&window[WS_NAME].readyState()!==1){
      isStartWs()
    }
  })
}
function setWslocalStorage (){
  window.localStorage.setItem(WS_LOCALSTORAGE_NAME,JSON.stringify(new Date))
}
function onBeforeunload (){
  window.addEventListener('beforeunload',()=>{
    deleteShareId()
  })
}
/** 设置当前页id到对应的缓存list中 */
function setShareList (id:string) {
  const list = getShareList()
  list.push(id)
  window.localStorage.setItem(SHARE_NAME,JSON.stringify(list))
}
/** 获取共享缓存的列表 */
function getShareList ():Array<string>{
  const list = window.localStorage.getItem(SHARE_NAME) || '[]'
  return JSON.parse(list)
}
/** 删除对应页签id */
//@ts-ignore
function deleteShareId (){
  const id = window[SHARE_PAGE_ID] 
  if(!id) return
  const list = getShareList()
  const index = list.indexOf(id)
  if(index<0) return
  list.splice(index,1)
  window.localStorage.setItem(SHARE_NAME,JSON.stringify(list))
}
/** 初始化设置共享页签id */
function initPageShareID (){
  if(window[SHARE_PAGE_ID]) return 
  const id = new Date().getTime().toString()
  window[SHARE_PAGE_ID] = id
  setShareList(id)
}
/** 启动ws，不是首个注册监听功能 */
function isStartWs (){
  const newDate =new Date().getTime()
  /**3个小时清空一次共享池，防止浏览器卡死导致关闭页面事件不触发 */
  if(getShareList()[0]&&newDate-Number(getShareList()[0])>10800){
    window.localStorage.setItem(SHARE_NAME,'[]')
  }
  if(window[SHARE_PAGE_ID] !== getShareList()[0]){
    onwsStorage(()=>{
      window[WS_NAME].handDispatchEvent({data:{subType:'sys.notify'}})
    })
  }else{
    window[WS_NAME]!.handOpen()
  }
}
export {
  initPageShareID,
  onBeforeunload,
  getShareList,
  onwsStorage,
  setWslocalStorage,
  isStartWs
}