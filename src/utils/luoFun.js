/**
 *打印
 *
 * @export
 * @param {*} content 需打印的内容 innerHTML
 * @param {*} [w=null]
 * @param {*} [h=null]
 * @returns
 */
export function MakePrint(content, userStyle, w = null, h = null) {
  
  // Fixes dual-screen position                         Most browsers      Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
  w = +w === 0 ? width : w;
  h = +h === 0 ? height : h;
  const left = ((width / 2) - (w / 2)) + dualScreenLeft;
  const top = ((height / 2) - (h / 2)) + dualScreenTop;
  var myWindow = window.open("", "打印", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
  var style = userStyle||"<style type='text/css'>table {font-family: verdana,arial,sans-serif;font-size:11px;color:#333333;border-width: 1px;border-color: #666666;border-collapse: collapse;}table th {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;}table td {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #ffffff;} img{max-width:130px;} .card-list{margin-bottom: 6px;width:25%;display:inline-block} .el-dropdown{display:inline-block} </style>";
  myWindow.document.write(content + style);
  myWindow.focus();
  myWindow.document.close();     //关闭document的输出流, 显示选定的数据
  // myWindow.print()
  myWindow.onload = ()=>{//页面渲染完成再打印
    myWindow.print()
  }
  // myWindow.print();   //打印当前窗口
  window.title = '交付平台'

  return myWindow;
}

import { Message } from 'element-ui'
/**
 *
 *需要Message依赖
 * @export 简化消息提示 
 * @param {*} {result,msgType,msg,cb}
 * {结果，消息类型，消息主体，回调函数}
 */
export function SimpleMsg({result, msgType, msg, cb, errCb,errorMsg}){
  let msgPre = ''
  switch(msgType){
      case 'edit': msgPre='修改';break;
      case 'delete': msgPre='删除';break;
      case 'add': msgPre='新增';break;
      case 'user':msgPre='';break;//用户不需前缀
  }
  if(result){
    Message({type:'success',message:`${msgPre}${msg?msg:'物流公司'}成功`})
    if(cb&&typeof cb == 'function'){
      cb()
    }
  }else{
    Message({type:'info',message:`${msgPre}${msg?msg:'物流公司'}失败${errorMsg?','+errorMsg:''}`})
    if(errCb&&typeof errCb == 'function'){
      errCb()
    }
  }
  
}