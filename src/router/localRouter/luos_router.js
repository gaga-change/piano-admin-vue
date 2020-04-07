const _import = require('../_import_' + process.env.NODE_ENV)
/* Layout */
import Layout from '../../views/layout/Layout'

export default [
  {
    path: '/commodity',
    component: Layout,
    redirect: 'commodity/commodityList',
    meta: { title: '商品管理', noCache: true, icon: 'deliver' },
    hidden: false,
    children: [
      {
        name: 'commodityList',
        path: 'commodityList',
        meta: { title: '商品列表', noCache: true },
        component: _import('commodity/commodityList'),
        hidden: false,
      },
    ]
  },
  {
    path: '/toDoTask',
    component: Layout,
    redirect: 'toDoTask/toDoTaskAuditList',
    meta: { title: '待办任务', noCache: true, icon: 'deliver' },
    hidden: false,
    children: [
      {
        name: 'toDoTaskAuditList',
        path: 'toDoTaskAuditList',
        meta: { title: '审核', noCache: true },
        component: _import('toDoTask/toDoTaskAuditList'),
        hidden: false,
      },
    ]
  },
  {
    path: '/inwarehousing',
    component: Layout,
    redirect: 'inwarehousing/arrival',
    meta: { title: '入库管理', noCache: true, icon: 'in' },
    hidden: false,
    children: [
      {
        name: 'inPlanList',
        path: 'inPlanList',
        meta: { title: '入库计划', noCache: true },
        component: _import('inwarehousing/inPlan/inPlanList'),
        hidden: false,
      },
      {
        name: 'inPlanAdd',
        path: 'inPlanAdd',
        meta: { title: '创建计划单', noCache: true },
        component: _import('inwarehousing/inPlan/inPlanAdd'),
        hidden: false,
      },
      {
        name: 'inrecord',
        path: 'inrecord',
        meta: { title: '收货单', noCache: true },
        component: _import('inwarehousing/inrecord'),
        hidden: false,
      },
      {
        name: 'inrecordDetail',
        path: 'inrecordDetail',
        meta: { title: '收货单详情', noCache: false },
        component: _import('inwarehousing/inrecordDetail'),
        hidden: false,
      },
      {
        name: 'goodsTotalList',
        path: 'goodsTotalList',
        meta: { title: '收货汇总', noCache: false },
        component: _import('inwarehousing/goodsTotalList'),
        hidden: false,
      },
      {
        name: 'goodsDetailList',
        path: 'goodsDetailList',
        meta: { title: '收货明细', noCache: false },
        component: _import('inwarehousing/goodsDetailList'),
        hidden: false,
      },
      {
        name: 'record',
        path: 'record',
        meta: { title: '上架记录', noCache: false },
        component: _import('inwarehousing/record'),
        hidden: false,
      },
      {
        name: 'inboundOrder',
        path: 'inboundOrder',
        meta: { title: '入库单', noCache: true },
        component: _import('inwarehousing/inboundOrder'),
        hidden: false,
      },
      {
        name: 'inboundOrderDetail',
        path: 'inboundOrderDetail',
        meta: { title: '入库单详情', noCache: true },
        component: _import('inwarehousing/inboundOrderDetail'),
        hidden: true,
      },
    ]
  },
  {
    path: '/outwarehousing',
    component: Layout,
    redirect: 'outwarehousing/outPlanList',
    meta: { title: '出库管理', noCache: true, icon: 'out' },
    hidden: false,
    children: [
      {
        name: 'outPlanList',
        path: 'outPlanList',
        meta: { title: '出库计划', noCache: true },
        component: _import('outwarehousing/outPlan/outPlanList'),
        hidden: false,
      },
      {
        name: 'outPlanAdd',
        path: 'outPlanAdd',
        meta: { title: '新建出库计划', noCache: true },
        component: _import('outwarehousing/outPlan/outPlanAdd'),
        hidden: false,
      },
      {
        name: 'assignPickingTasks',
        path: 'assignPickingTasks',
        meta: { title: '分配拣货任务', noCache: true },
        component: _import('outwarehousing/assignPickingTasks'),
        hidden: true,
      },
      {
        name: 'pickingtask',
        path: 'pickingtask',
        meta: { title: '拣货任务', noCache: true },
        component: _import('outwarehousing/pickingtask'),
        hidden: false,
      },
      {
        name: 'pickingTaskDetail',
        path: 'pickingTaskDetail',
        meta: { title: '拣货任务详情', noCache: true },
        component: _import('outwarehousing/pickingTaskDetail'),
        hidden: true,
      },
      {
        name: 'temporaryStorage',
        path: 'temporaryStorage',
        meta: { title: '出库暂存', noCache: true },
        component: _import('outwarehousing/temporaryStorage'),
        hidden: false,
      },
      {
        name: 'outboundOrder',
        path: 'outboundOrder',
        meta: { title: '出库单', noCache: true },
        component: _import('outwarehousing/outboundOrder'),
        hidden: false,
      },
      {
        name: 'outboundOrderDetail',
        path: 'outboundOrderDetail',
        meta: { title: '出库单详情', noCache: true },
        component: _import('outwarehousing/outboundOrderDetail'),
        hidden: true,
      },
    ]
  },
  {
    path: '/qualityTesting',
    component: Layout,
    redirect: 'qualityTesting/record',
    meta: { title: '质检管理', noCache: true, icon: 'deliver' },
    hidden: false,
    children: [
      {
        name: 'qualityTestingRecord',
        path: 'record',
        meta: { title: '质检记录', noCache: true },
        component: _import('qualityTesting/qualityTestingRecord'),
        hidden: false,
      },
      {
        name: 'qualityTestingDetail',
        path: 'detail',
        meta: { title: '质检记录详情', noCache: true },
        component: _import('qualityTesting/qualityTestingDetail'),
        hidden: false,
      },
      {
        name: 'qualityTestingCreate',
        path: 'create',
        meta: { title: '新建质检记录', noCache: true },
        component: _import('qualityTesting/qualityTestingCreate'),
        hidden: false,
      }
    ]
  },
  {
    path: '/takeStock',
    component: Layout,
    redirect: 'takeStock/billing',
    meta: { title: '盘点管理', noCache: true, icon: 'deliver' },
    hidden: false,
    children: [
      {
        name: 'takeStockBilling',
        path: 'billing',
        meta: { title: '盘点开单', noCache: true },
        component: _import('takeStock/takeStockBilling'),
        hidden: false,
      },
      {
        name: 'takeStockBillingDetail',
        path: 'detail',
        meta: { title: '盘点单详情', noCache: true },
        component: _import('takeStock/takeStockDetail'),
        hidden: false,
      },
      {
        name: 'takeStockRecord',
        path: 'record',
        meta: { title: '盘点录入', noCache: true },
        component: _import('takeStock/takeStockRecord'),
        hidden: false,
      },
      {
        name: 'takeStockList',
        path: 'list',
        meta: { title: '盘点单管理', noCache: true },
        component: _import('takeStock/takeStockList'),
        hidden: false,
      }
    ]
  },
  {
    path: '/inventoryLedger',
    component: Layout,
    redirect: 'inventoryLedger/inventory',
    meta: { title: '库存台账', noCache: true, icon: 'download' },
    hidden: false,
    children: [
      {
        name: 'inventory',
        path: 'inventory',
        meta: { title: '库位库存', noCache: true },
        component: _import('inventoryLedger/inventory'),
        hidden: false,
      },

      {
        name: 'stream',
        path: 'stream',
        meta: { title: '库存流水', noCache: true },
        component: _import('inventoryLedger/stream'),
        hidden: false,
      },

    ]
  },
  {
    path: '/baseInfo',
    component: Layout,
    redirect: 'baseInfo/inventoryArea',
    meta: { title: '基础资料', noCache: true, icon: 'info' },
    hidden: false,
    children: [
      {
        name: 'inventoryArea',
        path: 'inventoryArea',
        meta: { title: '库区管理', noCache: true },
        component: _import('baseInfo/inventoryArea'),
        hidden: false,
      },
      {
        name: 'inventorySite',
        path: 'inventorySite',
        meta: { title: '库位管理', noCache: true },
        component: _import('baseInfo/inventorySite'),
        hidden: false,
      },
      {
        name: 'productList',
        path: 'productList',
        meta: { title: '商品管理', noCache: true },
        component: _import('baseInfo/product/productList'),
        hidden: false,
      },
      {
        name: 'productAdd',
        path: 'productAdd',
        meta: { title: '创建商品', noCache: true },
        component: _import('baseInfo/product/productAdd'),
        hidden: false,
      },
      {
        name: 'productEdit',
        path: 'productAdd/edit',
        meta: { title: '编辑商品', noCache: true },
        component: _import('baseInfo/product/productAdd'),
        hidden: false,
      },
      {
        name: 'productDetail',
        path: 'productDetail',
        meta: { title: '商品详情', noCache: true },
        component: _import('baseInfo/product/productDetail'),
        hidden: false,
      },
      {
        name: 'packList',
        path: 'packList',
        meta: { title: '包装管理', noCache: true },
        component: _import('baseInfo/packList'),
        hidden: false,
      },
      {
        name: 'warehouseList',
        path: 'warehouseList',
        meta: { title: '仓库管理', noCache: true },
        component: _import('baseInfo/warehouseList'),
        hidden: false,
      },
      {
        name: 'warehouseUserList',
        path: 'warehouseUserList',
        meta: { title: '仓库用户', noCache: true },
        component: _import('baseInfo/warehouseUserList'),
        hidden: false,
      },
      {
        name: 'customerList',
        path: 'customerList',
        meta: { title: '合作关系管理', noCache: true },
        component: _import('baseInfo/customer/customerList'),
        hidden: false,
      },
      {
        name: 'customerAdd',
        path: 'customerAdd',
        meta: { title: '新增合作关系', noCache: true },
        component: _import('baseInfo/customer/customerAdd'),
        hidden: false,
      },
      {
        name: 'customerModify',
        path: 'customerAdd/edit',
        meta: { title: '编辑合作关系', noCache: true },
        component: _import('baseInfo/customer/customerAdd'),
        hidden: false,
      },
      {
        name: 'customerDetail',
        path: 'customerDetail',
        meta: { title: '合作关系详情', noCache: true },
        component: _import('baseInfo/customer/customerDetail'),
        hidden: false,
      },
    ]
  },
  {
    path: '/inventoryManage',
    component: Layout,
    redirect: 'inventoryManage/moveLibraryList',
    meta: { title: '库存管理', noCache: true, icon: 'info' },
    hidden: false,
    children: [
      {
        name: 'moveLibraryList',
        path: 'moveLibraryList',
        meta: { title: '移库', noCache: true },
        component: _import('inventoryManage/moveLibraryList'),
        hidden: false,
      },
      {
        name: 'moveLibraryRecordList',
        path: 'moveLibraryRecordList',
        meta: { title: '移库记录', noCache: true },
        component: _import('inventoryManage/moveLibraryRecordList'),
        hidden: false,
      },
      {
        name: 'stockCorrectList',
        path: 'stockCorrectList',
        meta: { title: '库存订正', noCache: true },
        component: _import('inventoryManage/stockCorrectList'),
        hidden: false,
      },
      {
        name: 'correctRecordList',
        path: 'correctRecordList',
        meta: { title: '订正记录', noCache: true },
        component: _import('inventoryManage/correctRecordList'),
        hidden: false,
      },
    ]
  },
  {
    path: '/appManage',
    component: Layout,
    redirect: 'appEditionList',
    meta: { title: 'APP管理', noCache: true, icon: 'info' },
    hidden: false,
    children: [
      {
        name: 'appEditionList',
        path: 'appEditionList',
        meta: { title: 'APP版本信息管理', noCache: true },
        component: _import('appManage/appEditionList'),
        hidden: false,
      },
      {
        name: 'modifyAppEdition',
        path: 'modifyAppEdition',
        meta: { title: 'APP版本信息修改', noCache: true },
        component: _import('appManage/modifyAppEdition'),
        hidden: true,
      },
      {
        name: 'newAppEdition',
        path: 'newAppEdition',
        meta: { title: 'APP版本信息新增', noCache: true },
        component: _import('appManage/newAppEdition'),
        hidden: true,
      },
    ]
  },
  {
    path: '/businessRule',
    component: Layout,
    redirect: 'batchList',
    meta: { title: '业务规则', noCache: true, icon: 'info' },
    hidden: false,
    children: [
      {
        name: 'batchList',
        path: 'batchList',
        meta: { title: '批次管理', noCache: true },
        component: _import('businessRule/batchList'),
        hidden: false,
      },
      {
        name: 'batchForm',
        path: 'batchForm',
        meta: { title: '批次创建', noCache: true },
        component: _import('businessRule/batchForm'),
        hidden: false,
      },
      {
        name: 'batchDetail',
        path: 'batchDetail',
        meta: { title: '批次详情', noCache: true },
        component: _import('businessRule/batchDetail'),
        hidden: false,
      },
    ]
  },
  {
    path: '/configManage',
    component: Layout,
    redirect: 'enumList',
    meta: { title: '系统配置中心', noCache: true, icon: 'info' },
    hidden: false,
    children: [
      {
        name: 'enumList',
        path: 'enumList',
        meta: { title: '枚举配置', noCache: true },
        component: _import('configManage/enumList'),
        hidden: false,
      }
    ]
  },
]
