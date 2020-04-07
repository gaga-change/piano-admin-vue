export function printPlanDataFn(data,params={plan:'inPlanQty',real:'inQty'}){
  if(data&&Array.isArray(data)){
    return data.map(item=>{
      // a.planReal = a.inPlanQty + '/' + a.inQty

      item.planReal = item[params.plan] + '/' + item[params.real]
      item.image = `/webApi/barcode?msg=${item.planCode}&type=code128&fmt=jpeg`
      return item
    })
  }else{
    return []
  }
}