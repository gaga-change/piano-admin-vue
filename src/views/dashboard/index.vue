<template>
  <div class="dashboard-container">
    <div class="left-area">
      <img
        :src="bgpath"
        alt=""
        style="width:100%;background:contain;"
      />
      <div class="mt20">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              <item-title>我的待办</item-title>
              <div>
                <div
                  :class="{'mt10': !!index}"
                  v-for="(item, index) in todoConfig"
                  :key="item.key"
                >
                  <span>{{item.name + '：'}}</span>
                  <router-link
                    class="c-primary"
                    :to="item.link"
                  >{{todolist[item.key] || 0}}</router-link>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">

            <div class="tabs">
              <div class="header-area">
                <div
                  class="left-area"
                  :class="{active: quickLinkShowIndex === 0}"
                  @click="quickLinkShowIndex=0"
                >
                  出库管理
                </div>
                <div
                  class="right-area"
                  :class="{active: quickLinkShowIndex === 1}"
                  @click="quickLinkShowIndex=1"
                >
                  入库管理
                </div>
              </div>
              <div class="container">
                <el-row :gutter="12">
                  <el-col
                    :span="6"
                    v-for="item in quickLinkConfig[quickLinkShowIndex]"
                    :key="item.name"
                  >
                    <el-card
                      shadow="hover"
                      class="mb15 link-item"
                    >
                      <router-link :to="item.link">
                        <p><i :class="item.icon"></i></p>
                        {{item.name}}
                      </router-link>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="right-area">
      <el-card class="">
        <!-- <div
          slot="header"
          class="clearfix"
        >
          <span>手持端二维码</span>
        </div> -->
        <item-title>手持端二维码</item-title>
        <img
          src="/app/api/appVersion/getQRCode"
          style="width:100%"
        >
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bgpath from '@/assets/images/bgimg.png'
// import printpath from '@/assets/images/print.png'
// import recordpath from '@/assets/images/inrecord.png'
// import salepath from '@/assets/images/onsale.png'
// import Inpath from '@/assets/images/warehousing.png'
// import outpath from '@/assets/images/outwarehousing.png'
// import assignmentpath from '@/assets/images/assignment.png'
// import pickpath from '@/assets/images/pickingtask.png'
// import confirmpath from '@/assets/images/confirm.png'
let todoConfig = [
  { name: '待审核', key: 'notCheck', link: '/toDoTask/toDoTaskAuditList?opStatus=0' },
  { name: '待收货', key: 'receive', link: '/inwarehousing/inPlanList?receiveStatus=0' },
  { name: '待上架', key: 'put', link: '/inwarehousing/goodsDetailList?isPut=0' },
  { name: '待入库', key: 'notInStore', link: '/inwarehousing/record?isCreateOrder=0' },
  { name: '待拣货', key: 'sort', link: '/outwarehousing/outPlanList?sortStatus=0' },
  { name: '待复核', key: 'review', link: '/outwarehousing/temporaryStorage' },
]
let quickLinkConfig = [
  [
    { name: '出库计划', icon: 'el-icon-edit-outline', link: '/outwarehousing/outPlanList' },
    { name: '拣货任务', icon: 'el-icon-document-copy', link: '/outwarehousing/pickingtask' },
    { name: '复核', icon: 'el-icon-document-checked', link: '/outwarehousing/temporaryStorage' },
    { name: '出库单', icon: 'el-icon-folder-opened', link: '/outwarehousing/outboundOrder' },
  ],
  [
    { name: '入库计划', icon: 'el-icon-files', link: '/inwarehousing/inPlanList' },
    { name: '收货单', icon: 'el-icon-sold-out', link: '/inwarehousing/inrecord' },
    { name: '收货明细', icon: 'el-icon-coin', link: '/inwarehousing/goodsDetailList' },
    { name: '上架记录', icon: 'el-icon-receiving', link: '/inwarehousing/record' },
    { name: '入库单', icon: 'el-icon-folder-opened', link: '/inwarehousing/inboundOrder' },
  ]
]
let count = 0
export default {
  name: 'dashboard',
  data() {
    return {
      bgpath,
      todoConfig,
      quickLinkConfig,
      quickLinkShowIndex: 0,
    }
  },
  computed: {
    ...mapGetters([
      'totalmenu',
      'todolist',
    ])
  },
  methods: {

  }
}

</script>

<style rel="stylesheet/scss" lang="scss">
.dashboard-container {
  display: flex;
  font-size: 14px;
  & > .left-area {
    flex: 1;
  }
  & > .right-area {
    margin-left: 20px;
    width: 200px;
  }
  .tabs {
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: 0.3s;
    border-radius: 4px;

    .header-area {
      display: flex;
      height: 40px;
      // background-color: #f5f7fa;
      background-color: #ebeef5;
      border-bottom: 1px solid #e4e7ed;
      color: #909399;
      cursor: pointer;
      & > div {
        width: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        &.active {
          background-color: #fff;
          color: #409eff;
        }
        &:hover {
          color: #409eff;
        }
      }
      .left-area {
        &.active {
          border-right-color: #dcdfe6;
          border-top-left-radius: 4px;
        }
      }
      .right-area {
        &.active {
          border-left-color: #dcdfe6;
          border-top-right-radius: 4px;
        }
      }
    }

    .container {
      min-height: 162px;
      padding: 15px;
      .link-item {
        text-align: center;
        .el-card__body {
          padding: 0;
        }
        a {
          display: block;
          width: 100%;
          height: 100%;
          padding: 10px;
        }
      }
    }
  }
}
// @media screen and (max-width: 1921px) {
//   .dashboard-container {
//     font-size: 30px;
//   }
// }
// @media screen and (max-width: 1681px) {
//   .dashboard-container {
//     font-size: 26.25px;
//   }
// }
// @media screen and (max-width: 1601px) {
//   .dashboard-container {
//     font-size: 25px;
//   }
// }
// @media screen and (max-width: 1441px) {
//   .dashboard-container {
//     font-size: 22.5px;
//   }
// }
// @media screen and (max-width: 1367px) {
//   .dashboard-container {
//     font-size: 21.34px;
//   }
// }
// @media screen and (max-width: 1281px) {
//   .dashboard-container {
//     font-size: 20px;
//   }
// }
// @media screen and (max-width: 1025px) {
//   .dashboard-container {
//     font-size: 16px;
//   }
// }
// .dashboard-container {
//   padding: 10px;
//   position: relative;
//   .menucontent {
//     margin-right: 8.4em;
//     padding-bottom: 1em;
//     height: 26.67em;
//     background: #fff;
//     box-shadow: 0 0.1em 0.3em 0.1em #f2f2f2;
//   }
//   .menudetail {
//     padding-left: 1.8em;
//   }
//   .singlecol {
//     margin-top: 1.2em;
//     text-align: center;
//     width: 8.2em;
//     height: 7.5em;
//     box-shadow: 0 0.1em 0.3em 0.1em #f2f2f2;
//     border-bottom: 2px solid #3486fd;
//     cursor: pointer;
//     &:hover {
//       box-shadow: 0 0.1em 0.3em 0.1em #c4c4c4;
//     }
//     .singleimg {
//       margin-top: 2.2em;
//       width: 2.33em;
//       height: 2.33em;
//     }
//     p {
//       font-size: 0.6em;
//       font-weight: bold;
//     }
//   }
//   .todolist {
//     position: absolute;
//     right: 0.67em;
//     top: 0.33em;
//     width: 7.33em;
//     height: 26.67em;
//     background: #fff;
//     box-shadow: 0 0.1em 0.3em 0.1em #f2f2f2;
//     padding-left: 0.33em;
//     .textTitle {
//       margin: 0.3em 0 1em;
//       padding-left: 0.33em;
//       position: relative;
//       height: 0.5em;
//       i {
//         font-style: normal;
//         font-size: 0.5em;
//         line-height: 0.5em;
//       }
//     }
//     .textTitle:before {
//       content: "";
//       background: #5769d9;
//       width: 0.2em;
//       height: 0.5em;
//       position: absolute;
//       left: 0;
//       top: 0.45em;
//       border-radius: 0.6em;
//     }
//     .tododetail {
//       margin-top: 0.5em;
//     }
//     span {
//       display: block;
//       height: 1em;
//       position: relative;
//       padding-left: 1.3em;
//       i {
//         font-style: normal;
//         font-size: 0.5em;
//         line-height: 1em;
//         u {
//           color: #227cff;
//           text-decoration: none;
//         }
//       }
//       &:before {
//         content: "";
//         position: absolute;
//         top: 0.2em;
//         left: 0;
//         width: 1em;
//         height: 1em;
//         background: url(/static/images/deliverylist.png) center center no-repeat;
//         background-size: 1em 1em;
//       }
//     }
//     .onsale {
//       &:before {
//         background-image: url(/static/images/salelist.png);
//       }
//     }
//     .picking {
//       &:before {
//         background-image: url(/static/images/pickingtasklist.png);
//       }
//     }
//     .confirm {
//       &:before {
//         background-image: url(/static/images/confirmlist.png);
//       }
//     }
//   }
// }
</style>
