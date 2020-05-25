<template>
  <div class="ComponentNameClass">
    <base-list
      ref="baseList"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :api="listApi"
      :parseData="parseData"
    >

    </base-list>
  </div>
</template>

<script>
import { sharesList } from '@/api'
const tableConfig = [
  { label: '分享者', prop: 'shareUserName' },
  { label: '关注者', prop: 'subUserName' },
  { label: '客户端', prop: 'type', type: 'enum', enum: 'shareTypeMap' },
  { label: '创建时间', prop: 'createdAt', type: 'time', width: 140 },
  { label: '修改时间', prop: 'updatedAt', type: 'time', width: 140 },
]
const searchConfig = [
  { label: '分享者Openid', prop: 'shareOpenid' },
  { label: '关注者Openid', prop: 'subscribeOpenid' },
]
export default {
  name: 'shareList',
  data() {
    return {
      tableConfig,
      searchConfig,
      listApi: sharesList,
      // 可选 附加查询条件
      appendSearchParams: {},
    }
  },
  methods: {
    /** 刷新列表 */
    getTableData() {
      this.$refs['baseList'].fetchData()
    },
    /** 可选 返回列表添加字段 */
    parseData(res) {
      let data = res.list || []
      let total = res.total
      data.forEach(v => {
        v.shareUserName = v.shareUser ? (`${v.shareUser.name}-${v.shareUser.phone}`) : v.shareOpenid
        v.subUserName = v.subscribeUser ? v.subscribeUser.name : v.subscribeOpenid
      })
      return { data, total }
    },
    /** 新建 */
    handleCreate() {
      this.$router.push({ path: '/qualityTesting/create' })
    },
    /** 删除 */
    handleDelete(row) {
      // this.$apiConfirm(`是否确定删除【${row.name}】？`, () => enumsDel(row.id)).then(res => {
      //   if (!res) return
      //   this.$message.success('操作成功！')
      //   this.getTableData()
      // })
    },
    activated() {
      if (!this.$store.state.tagsView.isNew) {
        this.getTableData()
      }
    },
  }
}
</script>