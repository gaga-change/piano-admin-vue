
export function deepExistMenu(menu,deepExist,notDeep) {
    var arr =[], index = 0;
    if(!Array.isArray(menu)){
        return arr
    }
    for(var i = 0;i<deepExist.length;i++){
        for(var j=0;j<menu.length;j++){
                if(deepExist[i].path === menu[j].path){
                  
                    arr[index] = menu[j]
                    if(!notDeep&&deepExist[i].children&&deepExist[i].children.length>0){
                        arr[index].children = deepExistMenu(menu[j].children,deepExist[i].children)
                    }
                    index++
                }
            }
    }
    
    return arr
  }
  



