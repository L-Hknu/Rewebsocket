const shareName = 'SHARE'
const wslocalStorageName= 'wslocalStorage'
/** 开启监听关闭页面删除对id */
function onwsStrong (callback:Function){
  window.addEventListener('strong',(e)=>{
    callback(e)
  })
}
function setWslocalStorage (){
  window.localStorage.setItem(wslocalStorageName,JSON.stringify(new Date))
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
  window.localStorage.setItem(shareName,JSON.stringify(list))
}
/** 获取共享缓存的列表 */
function getShareList ():Array<string>{
  const list = window.localStorage.getItem(shareName) || '[]'
  return JSON.parse(list)
}
/** 删除对应页签id */
function deleteShareId (){
  const id = window['sharePageID'] 
  const list = getShareList()
  const index = list.indexOf(id)
  list.splice(index,1)
  window.localStorage.setItem(shareName,JSON.stringify(list))
}
/** 初始化设置共享页签id */
function initPageShareID (){
  const id = new Date().getTime().toString()
  window['sharePageID'] = id
  setShareList(id)
}
/** 是否启动ws */
function isStartWs (){
  if(window['sharePageID'] !== getShareList()[0]) return
  window['reWebScoket']!.handOpen()
}
export {
  initPageShareID,
  onBeforeunload,
  getShareList,
  isStartWs,
  onwsStrong,
  setWslocalStorage
}