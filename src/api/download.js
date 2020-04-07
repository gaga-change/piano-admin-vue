import axios from 'axios'
import { Message } from 'element-ui'


export default options => axios({
  method: 'get',
  responseType: 'blob',
  ...options
}).then(res => {
  if (res.data.type === "application/json") {
    let reader = new FileReader()
    reader.addEventListener("loadend", function () {
      let data = JSON.parse(reader.result)
      Message.error(data.message || '导出失败，请稍后再试！')
    })
    reader.readAsText(res.data)
  } else {
    let filename = decodeURIComponent(res.headers['content-disposition'].split('filename=')[1])
    if (!~filename.indexOf('.xls')) {
      filename += '.xls'
    }
    let blob = new Blob([res.data])
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename)
    } else {
      let link = document.createElement("a")
      let evt = document.createEvent("HTMLEvents")
      evt.initEvent("click", false, false)
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
    }
  }
})