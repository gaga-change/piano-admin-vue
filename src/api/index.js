import http from './http'
import http3 from './http3'

import download from './download'

export * from './config'
export * from './app'

/** 商品列表 */
export const commodityList = params => http3.get(`/api/commodity`, params)
export const commodityCreate = params => http3.post(`/api/commodity`, params)
export const commodityDetail = id => http3.get(`/api/commodity/${id}`)
export const commodityDel = id => http3.delete(`/api/commodity/${id}`)
export const commodityModify = (id, params) => http3.put(`/api/commodity/${id}`, params)



/** 登录 */
export const userlogin = params => http3.post(`/api/auth/login`, params)
/** 退出登录 */
export const logout = () => http3.post(`/api/auth/logout`)
/** 获取用户信息 */
export const getInfo = () => http3.get(`/api/auth/account`)


/** 导出库位库存 */
export const exportLedger = params => download({ url: `/webApi/sku/stock/exportLedger`, params })
/** 盘点管理导出 */
export const inventoryRecordExport = data => download({ method: 'post', url: `/webApi/plan/inventory/recordExport`, data })
/** 收货汇总导出 */
export const receiveOrderExportLedger = params => download({ url: `/webApi/receive/order/exportLedger`, params })
/** 订正记录导出 */
export const stockCorrectionRecordExport = data => download({ method: 'post', url: `/webApi/stock/correction/recordExport`, data })
/** 上传文件 */
export const uploadReportFile = (formData, options = {}) => http.post('/webApi/plan/checkOrder/uploadReportFile', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  ...options
})

/** 用户登录选择仓库后绑定选择的仓库 */
export const setWarehouseCode = params => http.get(`/webApi/base/user/setWarehouseCode`, { params })
/** 获取代办 */
export const todolist = params => http.get(`/webApi/front/index/statistics`, { params })
/** 库存台账 */
export const getInfoInventory = params => http.get(`/webApi/sku/stock/querySkuStock`, { params })
export const getInfoOnPageInventory = params => http.get(`/webApi/sku/stock/querySkuStockList`, { params })
export const querySkuStockRecord = params => http.get(`/webApi/sku/stock/querySkuStockRecord`, { params })
export const querySkuStockByOutJobId = params => http.get(`/webApi/sku/stock/querySkuStockByOutJobId`, { params })
/** 删除库位 */
export const deleteInventorySite = params => http.post(`/webApi/basic/warehouseSpace/delete/${params.id}`)
/** 删除库区 */
export const deleteInventoryArea = params => http.get(`/webApi/basic/warehouseArea/delete/${params.id}`, { params })
export const getSelectInventoryAreaList = params => http.get(`/webApi/basic/warehouseArea/selectList`, { params })
export const selectSumSkuQty = params => http.get(`/webApi/sku/stock/selectSumSkuQty`, { params })
/** 获取入库计划详情 */
export const getInfoDetailWarehousing = params => http.get(`/webApi/plan/in/detail`, { params })
/** 获取入库详情 */
export const getInfoDetailInWarehousing = params => http.get(`/webApi/in/selectBarcodePrinting`, { params })
/** 获取出库单列表 */
export const getInfoOutWarehousing = params => http.get(`/webApi/outWarehouse/order/queryOutWarehouseOrder`, { params })
/** 获取出库单详情 */
export const getInfoDetailOutWarehousing = params => http.get(`/webApi/outWarehouse/order/queryOutWarehouseOrderList`, { params })
/** 一键提交入库单 */
export const inboundOrderSubmitQuick = params => http.get(`/webApi/in/upshelf/${params.id}`, { params })
/** 根据商品编码货主，供应商获取批次信息 */
export const getBatchNo = params => http.get(`/webApi/basic/batch/getBatchNo`, { params })
/** 查询明细列表 */
export const orderDetailList = id => http.get(`/webApi/receive/order/detailList/${id}`)
/** 根据条件查询库位 */
export const warehouseSpaceList = params => http.get(`/webApi/basic/warehouseSpace/list`, { params })
/** 查询拣货单列表 */
export const pickOrderList = params => http.get(`/webApi/pick/order/list`, { params })
/** 查询出库暂存列表 */
export const selectNotCreateOrderList = params => http.get(`/webApi/outWarehouse/job/selectNotCreateOrderList`, { params })
/** 根据拣货单id获取拣货单详情信息 */
export const pickOrderDetail = id => http.get(`/webApi/pick/order/detail/${id}`)
/** 查询存在需要复核任务的拣货单 */
export const pickOrderNotCreateOrder = params => http.get(`/webApi/pick/order/notCreateOrder`, { params })
/** 修改库位状态接口 */
export const warehouseSpaceUpdateLockStatus = (id, params) => http.get(`/webApi/basic/warehouseSpace/updateLockStatus/${id}`, { params })
/** 修改库区状态接口 */
export const warehouseAreaUpdateLockStatus = (id, params) => http.get(`/webApi/basic/warehouseArea/updateLockStatus/${id}`, { params })
/** 开单获取商品 */
export const planInventoryQuerysSkuStockList = params => http.post(`/webApi/plan/inventory/querysSkuStockList`, params)
/** 盘点录入查询 */
export const planInventoryQueryByOrderId = params => http.get(`/webApi/plan/inventory/queryByOrderId`, { params })
/** 分页查询盘点单列表 */
export const planInventoryList = params => http.get(`/webApi/plan/inventory/list`, { params })
/** 质检记录 */
export const checkOrderList = params => http.get(`/webApi/plan/checkOrder/list`, { params })
/** 波次分配子表 */
export const planOutDetail = params => http.get(`/webApi/plan/out/detail`, { params })
/** 通过质检单号查询质检报告记录 */
export const getCheckReportByOrderCode = params => http.get(`/webApi/plan/checkOrder/getCheckReportByOrderCode`, { params })
/** 通过id获取质检单详情 */
export const getCheckOrderDetail = params => http.get(`/webApi/plan/checkOrder/getCheckOrderDetail`, { params })
/** 引入收货单查询收货单记录 */
export const queryReceiverOrder = params => http.get(`/webApi/plan/checkOrder/queryReceiverOrder`, { params })
/** 分页查询移库记录 */
export const queryStockMoveList = params => http.get(`/webApi/sku/stock/queryStockMoveList`, { params })
/** 根据作业id删除出库作业 */
export const outWarehouseJobDel = params => http.get(`/webApi/outWarehouse/job/deleteById`, { params })
/** 查询待办任务列表 - 审核 */
export const inOutStopList = params => http.get(`/webApi/plan/inOutStop/list`, { params })
/** 获取入库计划列表 */
export const getInfoWarehousing = params => http.post(`/webApi/plan/in/list`, params)
/** 新增库位 */
export const addInventorySite = params => http.post(`/webApi/basic/warehouseSpace/addByBatch`, params)
/** 库位列表 */
export const warehouseSpaceSelect = params => http.post(`/webApi/basic/warehouseSpace/select`, params)
/** 物流登记信息新增 */
export const addLogisticsRegister = params => http.put(`/webApi/logistics/register/register`, params)
/** 修改密码接口 */
export const updatepassword = params => http.post(`/webApi/base/user/updatePwd`, params)
/** 库区列表 */
export const getInventoryArea = params => http.post(`/webApi/basic/warehouseArea/select`, params)
/** 新增库区 */
export const addInventoryArea = params => http.post(`/webApi/basic/warehouseArea/add`, params)
/** 修改库区 */
export const updateInventoryArea = params => http.post(`/webApi/basic/warehouseArea/update`, params)
/** 获取到货单列表 */
export const getArrivalList = params => http.post(`/webApi/receive/order/list`, params)
/** 新增收货单 */
export const orderAdd = params => http.post(`/webApi/receive/order/add`, params)
/** 获取入库列表 */
export const getInfoInWarehousing = params => http.post(`/webApi/in/list`, params)
/** 更改打印状态 */
export const modifyPrintState = params => http.post(`/webApi/plan/in/print`, params)
/** 更改出库打印状态 */
export const modifyOutPrint = params => http.post(`/webApi/plan/out/print`, params)
/** 获取出库计划单列表 */
export const getInfoPlanOutWarehousing = params => http.post(`/webApi/plan/out/list`, params)
/** 一键提交出库单 */
export const outboundOrderSubmitQuick = params => http.post(`/webApi/outWarehouse/order/directOutOfTheLibrary`, params)
/** 查询收货单列表 */
export const jobList = params => http.post(`/webApi/in/job/list`, params)
/** 添加入库单以及明细 */
export const inOrderAdd = params => http.post(`/webApi/in/order/add`, params)
/** 查询入库单列表 */
export const inOrderList = params => http.post(`/webApi/in/order/list`, params)
/** 新增拣货单 */
export const pickOrderAdd = params => http.post(`/webApi/pick/order/add`, params)
/** 拣货确认 */
export const orderPickConfirm = params => http.post(`/webApi/pick/order/pickConfirm`, params)
// /** 删除拣货单 */
// export const orderDelete = id => http.delete(`/webApi/pick/order/delete/${id}`)
// /** 拣货终止 */
// export const orderPickStop = id => http.post(`/webApi/pick/order/pickStop/${id}`)
/** 根据拣货任务生成出库单 */
export const createOutWareHouseOrder = params => http.post(`/webApi/outWarehouse/order/createOutWareHouseOrder`, params)
/** 库存移库 */
export const skuStockMove = params => http.post(`/webApi/sku/stock/stockMove`, params)
/** 状态转移 */
export const skuStockWriteCheckResult = params => http.post(`/webApi/sku/stock/writeCheckResult`, params)
/** 修改库位 */
export const basicWarehouseSpaceUpdate = params => http.post(`/webApi/basic/warehouseSpace/update`, params)
/** 盘点开单 */
export const insertInventoryOrder = params => http.post(`/webApi/plan/inventory/insertInventoryOrder`, params)
/** 盘点单取消或终止 */
export const inventoryRemoveOrStop = params => http.post(`/webApi/plan/inventory/removeOrStop`, params)
/** 盘点录入 */
export const inventoryInbentoryRecord = params => http.post(`/webApi/plan/inventory/inbentoryRecord`, params)
/** 上传质检报告 */
export const checkOrderAddReport = params => http.post(`/webApi/plan/checkOrder/addReport`, params)
/** 通过ID删除质检报告记录 */
export const deleteCheckReportById = params => http.post(`/webApi/plan/checkOrder/deleteCheckReportById`, params)
/** 新增质检单 */
export const checkOrderAddCheckOrder = params => http.post(`/webApi/plan/checkOrder/addCheckOrder`, params)
/** 商品列表 */
export const skuSelect = params => http.post(`/webApi/basic/sku/select`, params)
/** 包装列表 */
export const packageSelect = params => http.post(`/webApi/basic/package/select`, params)
/** 删除包装 */
export const packageDelete = id => http.get(`/webApi/basic/package/delete/${id}`)
/** 添加包装 */
export const packageSave = params => http.post(`/webApi/basic/package/save`, params)
/** 商品扩展配置 */
export const skuUpdate = params => http.post(`/webApi/basic/sku/update`, params)
/** 收货单列表 */
export const receiveOrderList = params => http.get(`/webApi/receive/order/list`, { params })
/** 收货单 激活 */
export const receiveOrderActivate = params => http.post(`/webApi/receive/order/activate`, params)
/** 收货单 终止 */
export const stopReceiveOrder = params => http.post(`/webApi/receive/order/stopReceiveOrder`, params)
/** 收货单详情 */
export const receiveOrderQueryDetails = params => http.get(`/webApi/receive/order/queryDetails`, { params })
/** 收货登记 */
export const receiveRegistration = params => http.post(`/webApi/receive/order/receiveRegistration`, params)
/** 获取动态盘点列表 */
export const queryDynamicSkuStockList = params => http.get(`/webApi/sku/stock/queryDynamicSkuStockList`, { params })
/** 创建收货单 */
export const createReceiveOrder = params => http.post(`/webApi/receive/order/createReceiveOrder`, params)
/** 收货明细汇总查询 */
export const selectSumReceiveDetail = params => http.post(`/webApi/receive/order/selectSumReceiveDetail`, params)
/** 收货明细查询 */
export const selectReceiveDetailItem = params => http.post(`/webApi/receive/order/selectReceiveDetailItem`, params)
/** 作废或删除收货明细 */
export const receiveOrderDeleteOrInvalid = params => http.post(`/webApi/receive/order/deleteOrInvalid`, params)
/** 收货确认 */
export const receiveConfirm = params => http.post(`/webApi/receive/order/receiveConfirm`, params)
/** 编辑收货明细 */
export const editorReceiveItem = params => http.post(`/webApi/receive/order/editorReceiveItem`, params)
/** 新增上架任务 */
export const inJobAdd = params => http.post(`/webApi/in/job/add`, params)
/** 自动新增拣货单 */
export const pickOrderAddByAuto = params => http.post(`/webApi/pick/order/addByAuto`, params)
/** 待办任务 - 审核 - 审核接口 */
export const inOutStopCheckTaskOrder = params => http.post(`/webApi/plan/inOutStop/checkTaskOrder`, params)
/** 仓库列表 */
export const warehouseSelect = params => http.post(`/webApi/basic/warehouse/select`, params)
/** 新增仓库 */
export const warehouseAdd = params => http.post(`/webApi/basic/warehouse/add`, params)
/** 用户列表 不分页 */
export const warehouseUserAll = params => http.post(`/webApi/basic/warehouse/user/userList`, params)
/** 新增用户仓库关系 */
export const warehouseUserAdd = params => http.post(`/webApi/basic/warehouse/user/add`, params)
/** 用户列表 分页 */
export const warehouseUserList = params => http.post(`/webApi/basic/warehouse/user/list`, params)
/** 仓库用户 删除 */
export const warehouseUserDelete = id => http.get(`webApi/basic/warehouse/user/delete/${id}`)
/** 修改仓库状态 */
export const updateWarehouseStatus = (id, params) => http.get(`/webApi/basic/warehouse/updateWarehouseStatus/${id}`, { params })
/** 根据仓库编码查询库区列表 */
export const warehouseAreaList = params => http.get(`/webApi/basic/warehouseArea/list`, { params })
/** 通过库区查询库位列表 */
export const warehouseSpaceSelectByAreaCode = params => http.get(`/webApi/basic/warehouseSpace/selectByAreaCode`, { params })
/** 出库计划单完结 */
export const panOutEnd = params => http.get(`/webApi/plan/out/end`, { params })
/** 出库单详情 */
export const outWarehouseOrderDetail = id => http.get(`/webApi/outWarehouse/order/detail/${id}`)
/** 出库单手动推送 */
export const outWarehouseOrderTryPush = id => http.get(`/webApi/outWarehouse/order/tryPush/${id}`)
/** 订正记录列表 */
export const stockCorrectionList = params => http.get(`/webApi/stock/correction/list`, { params })
/** 库存订正列表 */
export const correctionQueryStockList = params => http.get(`/webApi/stock/correction/queryStockList`, { params })
/** 库存订正 */
export const addStockCorrection = params => http.post(`/webApi/stock/correction/addStockCorrection`, params)
/** 入库计划单完结 */
export const planInEnd = params => http.get(`/webApi/plan/in/end`, { params })
/** 查询入库单详情 */
export const queryInOrderDetail = params => http.get(`/webApi/in/order/queryInOrderDetail`, { params })
/** 手动推送入库单 */
export const pushInOrder = params => http.get(`/webApi/in/order/pushInOrder`, { params })
/** 批次列表查询 */
export const lotList = params => http.post(`/webApi/basic/lot/list`, params)
/** 批次状态修改 */
export const lotUpdateStatus = (id, params) => http.get(`/webApi/basic/lot/updateStatus/${id}`, { params })
/** 批次新增 */
export const addLot = params => http.post(`/webApi/basic/lot/addLot`, params)
/** 批次详情 */
export const lotDetail = id => http.get(`/webApi/basic/lot/detail/${id}`)
/** 批次详情 */
export const selectLotDetailValue = params => http.get(`/webApi/basic/lot/selectLotDetailValue`, { params })
/** 客户列表 */
export const customerList = params => http.post(`/webApi/basic/customer/list`, params)
/** 新增客户 */
export const addCustomer = params => http.post(`/webApi/basic/customer/addCustomer`, params)
/** 修改客户 */
export const updateCustomer = params => http.post(`/webApi/basic/customer/updateCustomer`, params)
/** 新增商品 */
export const skuSave = params => http.post(`/webApi/basic/sku/save`, params)
/** 编辑商品 */
export const skuEdit = params => http.post(`/webApi/basic/sku/editSku`, params)
/** 客户详情 */
export const customerDetail = id => http.get(`/webApi/basic/customer/detail/${id}`)
/** 商品详情 */
export const skuQueryDetailById = params => http.get(`/webApi/basic/sku/queryDetailById`, { params })
/** 修改客户状态 */
export const customerUpdateStatus = (id, params) => http.get(`/webApi/basic/customer/updateStatus/${id}`, { params })
/** 删除商品 */
export const deleteSkuById = params => http.get(`/webApi/basic/sku/deleteSkuById`, { params })
/** 新增入库计划单 */
export const addInWarehousePlan = params => http.post(`/webApi/plan/in/addInWarehousePlan`, params)
/** 新增出库计划单 */
export const addOutWarehousePlan = params => http.post(`/webApi/plan/out/addOutWarehousePlan`, params)
