<template>
  <div class="ctabel TableIndexCom">
    <el-table
      :class="{'radio-table': highlightCurrentRow}"
      ref="table"
      v-loading="api ? selfLoading: loading"
      :element-loading-text="elementLoadingText"
      :element-loading-background="elementLoadingBackground"
      :data="data"
      :highlight-current-row="highlightCurrentRow"
      @current-change="handleCurrentRadioChange"
      :summary-method="summaryMethod"
      @selection-change="handleSelectionChange"
      @expand-change="handleExpandChange"
      :border="border"
      :show-summary="showSummary"
      size="mini"
      :style="tableStyle"
    >
      <template v-if="expand">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <slot
              name="expand"
              v-bind:row="scope.row"
              v-bind:index="scope.$index"
            ></slot>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-if="select"
        type="selection"
        width="55"
        :selectable="selectable"
      >
      </el-table-column>
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        :index="1"
      ></el-table-column>
      <template v-for="item in tableConfig">
        <el-table-column
          v-if="item.edit"
          :formatter="item.formatter"
          :fixed="item.fixed"
          :type="item.columnType"
          :width="item.width"
          :key="item.lable"
          :prop="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <el-input-number
              v-if="item.inputType==='number'"
              size="mini"
              v-model="scope.row[item.prop]"
              controls-position="right"
              :disabled="scope.row['inputTypeNumberDisabled']"
              :precision="item.precision || 0"
              @change="val => handleInputNumberChange(scope.row, scope.$index, item, val)"
              :min="item.min || 0"
              :max="item.max || 99999999"
            ></el-input-number>
            <el-input-number
              v-if="item.inputType==='number2'"
              size="mini"
              v-model="scope.row[item.prop]"
              controls-position="right"
              :disabled="scope.row['inputTypeNumberDisabled']"
              :precision="item.precision || 0"
              @change="val => handleInputNumberChange(scope.row, scope.$index, item, val)"
              :min="item.min || 0"
              :max="Number(scope.row[item.maxKey])"
            ></el-input-number>
            <el-input
              v-if="item.inputType==='input'"
              v-model="scope.row[item.prop]"
              :maxlength="item.max || 50"
            >
            </el-input>
            <el-select
              v-if="item.inputType==='select'"
              v-model="scope.row[item.prop]"
              placeholder="请选择"
            >
              <el-option
                v-for="(v, i) in mapConfig[item.enum] || []"
                :key="i"
                :label="v.name"
                :value="v.value"
              >
              </el-option>
            </el-select>
            <el-switch
              v-if="item.inputType==='switch'"
              v-model="scope.row[item.prop]"
              :active-value='item.activeValue'
              :inactive-value='item.inactiveValue'
              :disabled='item.disabled'
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :formatter="item.formatter"
          :fixed="item.fixed"
          :type="item.columnType"
          :width="item.width"
          :key="item.lable"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
        >
        </el-table-column>
      </template>
      <el-table-column
        v-if="showControl"
        :width="controlWidth"
        :fixed="showControlFixed ?'right' : false"
        :label="controlName"
      >
        <template slot-scope="scope">
          <div class="f12">
            <slot
              v-bind:row="scope.row"
              v-bind:index="scope.$index"
            ></slot>
            <slot
              name="edit"
              v-bind:row="scope.row"
              v-bind:index="scope.$index"
            ></slot>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template>
      <el-pagination
        :style="paginationStyle"
        @size-change="handleSelfSizeChange"
        @current-change="handleSelfCurrentChange"
        :current-page.sync="selfCurrentPage"
        :page-sizes="pageSizes"
        size="mini"
        :page-size="selfPageSize"
        :layout="layout"
        v-if="api"
        :total="selfTotal"
      ></el-pagination>
    </template>
  </div>
</template>

<script>

  import moment from 'moment';
  import {mapGetters} from 'vuex'

  export default {
    props: {
      /** 是否扩展 */
      expand: {
        type: Boolean,
        default: false,
      },
      /** 表格api接口 */
      api: {
        type: Function,
        default: null,
      },
      /** 表格api接口 -  解析接口返回的数据。 */
      parseData: {
        type: Function,
        default: null,
      },
      /** 表格api接口 - 搜索条件 */
      searchParams: {
        type: Object,
        default: () => {
        }
      },
      /** 是否可多选 */
      select: {
        type: Boolean,
        default: false,
      },
      /** 多选框 可选条件 */
      selectable: {
        type: Function,
        default: () => true
      },
      /** 是否展示序号 */
      showIndex: {
        type: Boolean,
        default: false
      },
      /** 显示 【操作】 */
      showControl: {
        type: Boolean,
        default: false
      },
      /** 操作栏 是否固定右侧 */
      showControlFixed: {
        type: Boolean,
        default: true
      },
      /** 显示 【操作】 - 更改名称 */
      controlName: {
        type: String,
        default: '操作'
      },
      /** 显示 【操作】 - 宽度 */
      controlWidth: {
        type: Number,
        default: 160
      },
      loading: {
        type: Boolean,
        default: false
      },
      highlightCurrentRow: {
        type: Boolean,
        default: false
      },
      showSummary: {
        type: Boolean,
        defalut: false
      },
      summaryMethod: {
        type: Function,
        default: () => {
        }
      },
      data: {
        type: Array,
        default: () => []
      },
      config: {
        type: Array,
        default: () => []
      },
      pageSizes: {
        type: Array,
        default: () => [10, 20, 30, 50]
      },
      layout: {
        type: String,
        default: "total, sizes, prev, pager, next, jumper"
      },
      elementLoadingText: {
        type: String,
        default: "加载中"
      },
      elementLoadingBackground: {
        type: String,
        default: "rgba(255, 255, 255, 0.5)"
      },
      border: {
        type: Boolean,
        default: true
      },
      tableStyle: {
        type: String,
        default: "width: 100%"
      },
      paginationStyle: {
        type: String,
        default: "marginTop:16px"
      }
    },
    data() {
      return {
        tableConfig: [],
        selfTotal: 0,
        selfPageSize: 10,
        selfCurrentPage: 1,
        selfLoading: true,
      }
    },
    computed: {
      ...mapGetters([
        'mapConfig',
      ])
    },
    watch: {
      config() {
        this.turnConfig()
      }
    },
    mounted() {
      if (this.api) {
        this.fetchData()
      }
    },
    beforeMount() {
      this.turnConfig()
    },
    methods: {
      turnConfig() {
        let tableConfig = this.$copy(this.config)
        tableConfig.forEach(configItem => {
          if (configItem.type) {
            switch (configItem.type) {
              case 'enum': {
                if (typeof configItem.enum === 'string') {
                  configItem.formatter = (row, column, cellValue) => {
                    let res = cellValue
                    if (!configItem.enum) {
                      console.error(`列【${configItem.label} : ${configItem.prop}】,需要 【enum】字段`)
                    } else {
                      const enumArr = this.mapConfig[configItem.enum] || []
                      if (!enumArr.length && Object.keys(this.mapConfig).length) {
                        console.error(`枚举异常, 【${configItem.enum}】未配置`)
                      }
                      let temp = enumArr.find(v => v.value === this.$turnNumber(cellValue))
                      if (temp) {
                        res = temp.name
                      } else {
                        // console.error(`枚举异常, 在【${configItem.type}】下未找到相应枚举值【${cellValue}】`)
                        res = ''
                      }
                    }
                    return res
                  }
                } else {
                  configItem.formatter = (row, column, cellValue) => {
                    let res = cellValue
                    if (!configItem.enum) {
                      console.error(`列【${configItem.label} : ${configItem.prop}】,需要 【enum】字段`)
                    } else {
                      let temp = configItem.enum.find(v => v.value === this.$turnNumber(cellValue))
                      if (temp) {
                        res = temp.name
                      } else {
                        // console.error(`枚举异常, 在【${configItem.type}】下未找到相应枚举值【${cellValue}】`)
                        res = ''
                      }
                    }
                    return res
                  }
                }
              }
                break
              case 'enums':
                configItem.formatter = (row, column, cellValue) => {
                  const enumArr = this.mapConfig[configItem.enum] || []
                  return cellValue.map(id => {
                    let temp = enumArr.find(v => v.value === id)
                    return temp && temp.name
                  }).filter(v => v).join('，')
                }
                break
              case 'time':
                configItem.formatter = (row, column, cellValue) => cellValue ? moment(cellValue).format(configItem.format || 'YYYY-MM-DD HH:mm:ss') : '';
                break
              case 'Boolean':
                configItem.formatter = (row, column, cellValue) => cellValue ? '是' : '否'
                break
              case 'index':
                configItem.formatter = (row, column, cellValue, index) => (this.selfPageSize) * (this.selfCurrentPage - 1) + index + 1
                break
              case 'toFixed':
                configItem.formatter = (row, column, cellValue) => cellValue && Number(Number(cellValue).toFixed(2))
                break
            }
          } else if (configItem.dom) {
            configItem.formatter = configItem.dom
          } else {
            configItem.formatter = (row, column, cellValue) => cellValue !== undefined && cellValue !== null && cellValue !== '' ? cellValue : ''
          }
        })
        this.tableConfig = tableConfig;
      },
      /** 展开或收拢 所有子表 */
      toggleRowExpansionAll(expanded) {
        this.data.forEach(item => {
          this.$refs['table'].toggleRowExpansion(item, expanded)
        })
      },
      /** 清除选中 */
      clearSelection() {
        this.$refs.table.clearSelection()
      },
      /** 输入框内容改变 */
      handleInputNumberChange(row, index, item, value) {
        this.$emit('inputNumberChange', {row, index, item, value})
      },
      /** 展开 行 */
      handleExpandChange(row) {
        this.$emit('expandChange', row)
      },
      fetchData() {
        this.selfLoading = true
        let temp = this.$copy(this.searchParams)
        Object.keys(temp).forEach(key => {
          if (temp[key] === undefined || temp[key] === '') {
            delete temp[key]
          }
        })
        return this.api({
          pageNum: this.selfCurrentPage,
          pageSize: this.selfPageSize,
          ...temp
        }).then(res => {
          this.selfLoading = false
          if (!res) return
          let data
          let total
          if (this.parseData) {
            let obj = this.parseData(res)
            data = obj.data
            total = obj.total
          } else {
            data = res.list || []
            total = res.total
          }
          data.forEach(item => {
            item._batchNoDetailLoading = false
            item._batchNoDetail = null
          })
          this.$emit('update:data', data)
          this.$emit('updateList')
          this.selfTotal = total
        })
      },
      handleSelfSizeChange(val) {
        this.selfPageSize = val
        this.fetchData()
      },
      handleSelfCurrentChange(val) {
        this.selfCurrentPage = val
        this.fetchData()
      },
      /** 单选 */
      handleCurrentRadioChange(currentRow, oldCurrentRow) {
        this.$emit('currentChange', currentRow, oldCurrentRow)
      },
      /** 多选 */
      handleSelectionChange(val) {
        this.$emit('selectionChange', val)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .TableIndexCom {
    td {
      word-break: break-word;
    }

    .radio-table {
      tbody {
        tr {
          cursor: pointer;
        }
      }
    }
  }

  .ctabel {
    width: 100%;

    .el-radio__label {
      display: none;
    }
  }
</style>

