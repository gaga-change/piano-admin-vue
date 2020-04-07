
export const LoginPath = process.env.NODE_ENV === 'production' ? 'http://sso.csjscm.com' : 'http://192.168.1.224:8099'
// export const LoginPath = 'http://sso.csjscm.com'
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    if (time && typeof time === 'string' && !time.includes('Z')) time = time.replace(new RegExp(/-/gm), '/')
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  // time = +time * 1000
  if (time && !time.includes('Z')) time = time.replace(new RegExp(/-/gm), '/')
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}


export function printUrl(url, name, id) {
  return url + name + '.cpt&id=' + id
}

// http://nb.csjscm.com:9999/WebReport/ReportServer?reportlet=/HALL_TEST/supply_invoice_export.cpt&id=3

export function reportCenterUrl(name) {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return 'http://nb.csjscm.com:9999/WebReport/ReportServer?reportlet=/HALL_TEST/' + name + '.cpt'
  } else if (process.env.NODE_ENV === 'production') {
    return 'http://nb.csjscm.com:9999/WebReport/ReportServer?reportlet=/HALL/' + name + '.cpt'
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

// 返回连续时间段的数据
export function DealChartDataByDay(data, type, params) {
  // 排序函数
  const sortData = function (a, b) {
    if (parseInt(b[type].replace(/\-/g, '')) > parseInt(a[type].replace(/\-/g, ''))) {
      return -1
    } else if (parseInt(b[type].replace(/\-/g, '')) < parseInt(a[type].replace(/\-/g, ''))) {
      return 1
    } else if (parseInt(b[type].replace(/\-/g, '')) === parseInt(a[type].replace(/\-/g, ''))) {
      return 0
    }
  }
  // 对数组进行排序
  const sortedData = data.sort(sortData)
  // 取得数据开始和结束
  const beginDate = parseInt(sortedData[0][type].replace(/\-/g, ''))
  const now = new Date()
  const nowMonth = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1).toString()
  const nowDate = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
  const nowFullDate = parseInt(now.getFullYear().toString() + nowMonth + nowDate)
  // 取得前一的时间
  function getPreDate(d) {
    const nd = new Date()
    const argtime = nd.setFullYear(parseInt(d.toString().slice(0, 4)), parseInt(d.toString().slice(4, 6)) - 1, parseInt(d.toString().slice(6, 8)))
    const preDate = new Date(argtime - 24 * 60 * 60 * 1000)
    const preDateMonth = (preDate.getMonth() + 1) < 10 ? '0' + (preDate.getMonth() + 1) : (preDate.getMonth() + 1).toString()
    const preDateDate = preDate.getDate() < 10 ? '0' + preDate.getDate() : preDate.getDate()
    const preDateFullDate = parseInt(preDate.getFullYear().toString() + preDateMonth + preDateDate)
    return preDateFullDate
  }
  // 生成开始时间到今天的时间数组
  const timearr = []
  // 开始时间大于当前时间可能是本地时间设置错误
  if (beginDate > nowFullDate) {
    return false
  }
  let pm = nowFullDate
  while (pm >= beginDate) {
    timearr.push(pm)
    pm = getPreDate(pm)
  }
  let returnData = []
  timearr.map(item => {
    if (params) {
      const attr = { ...params }
      attr[type] = item.toString().slice(0, 4) + '-' + item.toString().slice(4, 6) + '-' + item.toString().slice(6, 8)
      returnData.push(attr)
    }
  })
  returnData.forEach(item => {
    data.map(d => {
      if (d[type] === item[type]) {
        for (const key in params) {
          item[key] = d[key]
        }
      }
    })
  })
  returnData = returnData.reverse()
  return returnData
}

// 返回连续时间段的数据
export function DealChartDataByMonth(data, type, params) {
  // 排序函数
  const sortData = function (a, b) {
    return parseInt(b[type].replace(/\-/g, '')) < parseInt(a[type].replace(/\-/g, ''))
  }
  // 对数组进行排序
  const sortedData = data.sort(sortData)
  // 取得数据开始和结束
  const beginMonth = parseInt(sortedData[0][type].replace(/\-/g, ''))
  const now = new Date()
  const nowMonth = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1).toString()
  const nowFullDate = parseInt(now.getFullYear().toString() + nowMonth)
  // 取得前一月的时间
  function getPreMonth(d) {
    const nd = new Date()
    // 计算当前月份天数
    let currentMonthDays = 30
    const currentMonth = parseInt(d.toString().slice(4, 6))
    const currentYear = parseInt(d.toString().slice(0, 4))
    if ([1, 3, 5, 7, 8, 10, 12].includes(currentMonth)) {
      currentMonthDays = 31
    } else if (currentMonth === 2) {
      // 如果是闰年
      if (((currentYear % 4) === 0) && ((currentYear % 100) !== 0) || ((currentYear % 400) === 0)) {
        currentMonthDays = 29
      } else {
        currentMonthDays = 28
      }
    }
    const argtime = nd.setFullYear(parseInt(d.toString().slice(0, 4)), parseInt(d.toString().slice(4, 6)) - 1, currentMonthDays)
    const preDate = new Date(argtime - 24 * 60 * 60 * 1000 * currentMonthDays)
    const preDateMonth = (preDate.getMonth() + 1) < 10 ? '0' + (preDate.getMonth() + 1) : (preDate.getMonth() + 1).toString()
    const preDateFullDate = parseInt(preDate.getFullYear().toString() + preDateMonth)
    return preDateFullDate
  }
  // 生成开始时间到今天的时间数组
  const timearr = []
  // 开始时间大于当前时间可能是本地时间设置错误
  if (beginMonth > nowFullDate) {
    return false
  }
  let pm = nowFullDate
  while (pm >= beginMonth) {
    timearr.push(pm)
    pm = getPreMonth(pm)
  }
  let returnData = []
  timearr.map(item => {
    if (params) {
      const attr = { ...params }
      attr[type] = item.toString().slice(0, 4) + '-' + item.toString().slice(4, 6)
      returnData.push(attr)
    }
  })
  returnData.forEach(item => {
    data.map(d => {
      if (d[type] === item[type]) {
        for (const key in params) {
          item[key] = d[key]
        }
      }
    })
  })
  returnData = returnData.reverse()
  return returnData
}

export const PayFundnature = [
  {
    name: '货款',
    value: 1
  },
  {
    name: '服务费',
    value: 2
  },
  {
    name: '投标保证金',
    value: 3
  }
]
export const PayFundtype = [
  {
    name: '预付款',
    value: 1
  },
  {
    name: '提货款',
    value: 3
  },
  {
    name: '质保金',
    value: 4
  }
]
export const ReciveFundtype = [
  {
    name: '预收款',
    value: 2
  },
  {
    name: '提货款',
    value: 3
  },
  {
    name: '质保金',
    value: 4
  }
]
export const ReciveFundnature = [
  {
    name: '货款',
    value: 1
  },
  {
    name: '服务费',
    value: 2
  },
  {
    name: '投标保证金',
    value: 4
  }
]
export const SettlementMethod = [
  {
    name: '现金',
    value: 1
  },
  {
    name: '银行转账',
    value: 2
  },
  {
    name: '银行承兑',
    value: 3
  },
  {
    name: '商业承兑',
    value: 4
  },
  {
    name: '支票',
    value: 5
  }
]

// 发票类型1增值税专用发票 2增值税普通发票 3普通发票 4无票收入

export const InvoiceType = [
  {
    name: '增值税专用发票',
    value: '1'
  },
  {
    name: '增值税普通发票',
    value: '2'
  },
  {
    name: '普通发票',
    value: '3'
  },
  {
    name: '无票收入',
    value: '4'
  }
]

export const Status = [
  // {
  //   name: '草稿', value: -1
  // },
  {
    name: '待审核', value: 0
  },
  {
    name: '确认通过', value: 1
  },
  {
    name: '驳回', value: -2
  }
]

export const ReceiptStatus = [
  {
    name: '待回单', value: 0
  },
  {
    name: '回单已登记', value: 1
  },
  {
    name: '回单完成', value: 2
  }
]

export const serviceLevel = [
  {
    name: '一级', value: 1
  },
  {
    name: '二级', value: 2
  }
]

export const BusinessTypeData = [
  {
    name: '钢铁板块',
    value: 0
  },
  {
    name: '汽车板块',
    value: 1
  }
]

export const BidStatus = [
  {
    name: '待确认',
    value: 0
  },
  {
    name: '中标',
    value: 2
  },
  {
    name: '未中标',
    value: 3
  },
  {
    name: '已投标',
    value: 4
  }
]

export const DistributeStatus = [
  {
    name: '未分配',
    value: 0
  },
  {
    name: '已分配',
    value: 1
  },
  {
    name: '部分分配',
    value: 2
  },
  {
    name: '询价完成',
    value: 3
  }
]

export const NatureInvoice = [

  {
    name: '篮字发票',
    value: 0
  },

  {
    name: '红字发票',
    value: 1
  },

]




export function downloadFile(file) {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    if (file.includes('/file')) {
      return 'http://testscm.csjmro.com' + file
    } else {
      return 'http://testscm.csjmro.com/file' + file
    }
  } else if (process.env.NODE_ENV === 'production') {
    if (file.includes('/file')) {
      return 'http://scm.csjmro.com' + file
    } else {
      return 'http://scm.csjmro.com/file' + file
    }
  }
}

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
  var style = userStyle || `<style type='text/css'>
.c-333 {
  color: #333;
}
.c-666 {
  color: #666;
}
.c-ccc {
  color: #ccc;
}
.c-red {
  color: red;
}
.f12 {
  font-size: 12px;
}
.f14 {
  font-size: 14px;
}
.f16 {
  font-size: 16px;
}
.f18 {
  font-size: 18px;
}
.f20 {
  font-size: 20px;
}
.f22 {
  font-size: 22px;
}
.f24 {
  font-size: 24px;
}
.f26 {
  font-size: 26px;
}
.f28 {
  font-size: 28px;
}
.fw400 {
  font-weight: 400;
}
.fw500 {
  font-weight: 500;
}
.fw600 {
  font-weight: 600;
}
.fw700 {
  font-weight: 700;
}
.ml5 {
  margin-left: 5px;
}
.ml10 {
  margin-left: 10px;
}
.ml15 {
  margin-left: 15px;
}
.ml20 {
  margin-left: 20px;
}
.ml25 {
  margin-left: 25px;
}
.mr5 {
  margin-right: 5px;
}
.mr10 {
  margin-right: 10px;
}
.mr15 {
  margin-right: 15px;
}
.mr20 {
  margin-right: 20px;
}
.mr25 {
  margin-right: 25px;
}
.mt5 {
  margin-top: 5px;
}
.mt10 {
  margin-top: 10px;
}
.mt15 {
  margin-top: 15px;
}
.mt20 {
  margin-top: 20px;
}
.mt25 {
  margin-top: 25px;
}
.mb5 {
  margin-bottom: 5px;
}
.mb10 {
  margin-bottom: 10px;
}
.mb15 {
  margin-bottom: 15px;
}
.mb20 {
  margin-bottom: 20px;
}
.mb25 {
  margin-bottom: 25px;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.clearfix::after {
  content: "";
  clear: both;
}
.nowrap {
  white-space: nowrap;
}
    table { width: 100%; font-family: verdana,arial,sans-serif;font-size:11px;color:#333333;border-width: 1px;border-color: #666666;border-collapse: collapse;}
    table th {text-align: left; border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;}
    table td {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #ffffff;}
    img{max-width:130px;}
    img {width: 100%;}
    .card-list{margin-bottom: 6px;width:25%;display:inline-block}
    .el-dropdown{display:inline-block}
  </style>`;
  myWindow.document.write(content + style);
  myWindow.focus();
  myWindow.document.close();     //关闭document的输出流, 显示选定的数据
  // myWindow.print()
  myWindow.onload = () => {//页面渲染完成再打印
    myWindow.print()
  }
  // myWindow.print();   //打印当前窗口
  window.title = '交付平台'

  return myWindow;
}