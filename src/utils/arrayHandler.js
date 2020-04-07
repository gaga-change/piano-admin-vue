
/**
 *
 *
 * @export
 * @param {*} arr 原始数据
 * @param {*} uniqueParams 依据哪个参数去重
 */
export function uniqueArray(arr,uniqueParams){
  var uniqueArr = [],hashArr =[];
  if(arr&&Array.isArray(arr)){
    if(!uniqueParams){
      return arr
    }
    arr.map(item => {
      if(!hashArr.includes(item[uniqueParams])){
        hashArr.push(item[uniqueParams]),
        uniqueArr.push(item)
      }
    })
    return uniqueArr
  }else{
    throw new Error('去重数据必须为数组')
  }
}