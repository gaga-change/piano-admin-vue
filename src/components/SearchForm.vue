<template>
  <div>
    <el-card
      class="simpleCard"
      shadow="hover"
      body-style="padding:12px"
    >
      <el-form
        :model="searchForms"
        :rules="searchRules"
        ref="searchForm"
        :label-width="labelWidth+'px'"
        :inline="true"
      >
        <el-form-item
          v-for="(item,index) in [...config, ...batchAppendInputList]"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :label-width="item.labelWidth ? item.labelWidth + 'px' : undefined"
        >
          <template v-if="item.type === 'enum' && typeof item.enum === 'object'">
            <el-select
              v-model="searchForms[item.prop]"
              clearable
              :placeholder="`请选择${item.label}`"
              size="mini"
              @change="hanldeSubmit"
            >
              <el-option
                v-for="(item, index) in item.enum"
                :key="index"
                :label="item"
                :value="item + ''"
              >
              </el-option>
            </el-select>
          </template>
          <template v-else-if="item.type === 'enum'">
            <el-select
              v-model="searchForms[item.prop]"
              clearable
              :placeholder="`请选择${item.label}`"
              size="mini"
              @change="hanldeSubmit"
            >
              <el-option
                v-for="(item, index) in mapConfig[item.enum]"
                :key="index"
                :label="item.name"
                :value="item.value + ''"
              >
              </el-option>
            </el-select>
          </template>
          <template v-else-if="item.type === 'radio'">
            <el-radio-group v-model="searchForms[item.prop]">
              <el-radio
                :label="v.value"
                v-for="v in mapConfig[item.radio]"
                :key="v.value"
              >{{v.name}}</el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="item.type === 'timeArea'">
            <el-date-picker
              size="mini"
              v-model="searchForms[item.prop]"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            >
            </el-date-picker>
          </template>
          <template v-else-if="item.type === 'warehouseAreaCode'">
            <el-select
              size="mini"
              v-model="searchForms.warehouseAreaCode"
              placeholder="请选择库区"
              @change="warehouseAreaCodeChange"
              :loading="getSelectInventoryAreaListLoading"
            >
              <el-option
                v-for="(item, index) in warehouseArea"
                :key="index"
                :label="item.warehouseAreaName"
                :value="item.warehouseAreaCode"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="item.type === 'warehouseSpaceCode'">
            <el-select
              size="mini"
              v-model="searchForms.warehouseSpaceCode"
              placeholder="请选择库位"
              :loading="getInventorySiteLoading"
            >
              <el-option
                v-for="(item, index) in warehouseSpace"
                :key="index"
                :label="item.warehouseSpaceCode"
                :value="item.warehouseSpaceCode"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="item.type === 'batchRule'">
            <el-cascader
              v-model="batchRule"
              collapse-tags
              :props="batchRuleProps"
              @change="handleBatchRuleChange"
            ></el-cascader>
          </template>
          <template v-else-if="item.type === 'date'">
            <el-date-picker
              style="width:178px;"
              placeholder="请选择"
              v-model="searchForms[item.prop]"
              :type="item.dateType"
              :value-format="item.valueFormat"
              :format="item.format"
            >
            </el-date-picker>
          </template>
          <template v-else>
            <el-input
              style="width:178px;"
              type="text"
              size="mini"
              :placeholder="`请输入${item.label}`"
              v-model="searchForms[item.prop]"
            ></el-input>
          </template>
        </el-form-item>
        <el-form-item :style="btnInline ? '' : 'display: block'">
          <el-button
            size="mini"
            type="primary"
            @click="hanldeSubmit"
            :disabled="resetLoading"
            :loading="submitLoading"
          >查询</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="hanldeResetForm"
            :disabled="submitLoading"
            :loading="resetLoading"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSelectInventoryAreaList, warehouseSpaceSelect, lotList, lotDetail } from '@/api'
let id = 0
export default {
  props: {
    config: {
      type: Array,
      default: () => []
    },
    /** 搜索 label宽度 */
    labelWidth: {
      type: Number,
      default: 80
    },
    /** 搜索按钮 是否和输入框在同一行 */
    btnInline: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      lastFa: null,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      getSelectInventoryAreaListLoading: false,
      getInventorySiteLoading: false,
      resetLoading: false,
      submitLoading: false,
      searchForms: {},
      searchRules: {},
      warehouseArea: [],
      warehouseSpace: [],
      spanMap: {
        'timeArea': 16
      },
      batchRule: [],
      batchRuleProps: {
        multiple: true,
        checkStrictly: true,
        expandTrigger: 'hover',
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          if (node.isLeaf) {
            return resolve([])
          }
          if (level === 0) {
            lotList({ pageNum: 1, pageSize: 9999, status: 0 }).then(res => {
              resolve([])
              if (!res) return
              resolve(res.data.list.map(v => {
                return {
                  value: v,
                  label: v.lotName,
                  leaf: false
                }
              }))
            })
          } else {
            lotDetail(node.value.id).then(res => {
              resolve([])
              if (!res) return
              resolve(res.data.lotDetailList.filter(v => v.status === 0).map(v => {
                return {
                  value: v,
                  label: v.lotAttrName,
                  leaf: true
                }
              }))
            })
          }
          // setTimeout(() => {
          //   const nodes = Array.from({ length: level + 1 })
          //     .map(item => ({
          //       value: ++id,
          //       label: `选项${id}`,
          //       leaf: level >= 2
          //     }));
          //   // 通过调用resolve将子节点数据返回，通知组件数据加载完成
          //   resolve(nodes);
          // }, 1000);
        }
      }
    }
  },
  computed: {
    inputItems() {
      return this.config.filter(v => !v.type)
    },
    configRange() {
      return this.config.filter(v => v.props)
    },
    ...mapGetters([
      'chooseWarehouse',
      'mapConfig'
    ]),
    batchAppendInputList() {
      if (!this.batchRule) return []
      return this.batchRule.filter(v => v.length === 2).map(v => {
        let temp = v[1]
        this.$set(this.searchForms, temp.lotAttrCode, '')
        let item = {
          label: temp.lotAttrName,
          prop: temp.lotAttrCode
        }
        temp.lotAttrValue = temp.lotAttrValue || '{}'
        try {
          let lotAttrValue = JSON.parse(temp.lotAttrValue)
          if (temp.lotAttrType === 3) { // 枚举
            item.type = 'enum'
            item.enum = lotAttrValue.enum
          }
          if (temp.lotAttrType === 4) { // 日期
            item.type = 'date'
            switch (lotAttrValue.format) {
              case 'YYYY':
                item.dateType = 'year'
                item.valueFormat = 'yyyy'
                item.format = 'yyyy 年'
                break
              case 'YYYY-MM':
                item.dateType = 'month'
                item.valueFormat = 'yyyy-MM'
                item.format = 'yyyy 年 MM 月'
                break
              case 'YYYY-MM-DD':
                item.dateType = 'date'
                item.valueFormat = 'yyyy-MM-dd'
                item.format = 'yyyy 年 MM 月 dd 日'
                break
            }
          }
        } catch (err) {
          console.error(`lotAttrType解析异常：${temp.lotAttrType}`, temp)
        }
        return item
      })
    },
    batchId() {
      // if (!this.batchRule) return ''
      // let temp = this.batchRule.filter(v => v.length === 1)
      // if (temp.length === 1) {
      //   return temp[0][0].id + ''
      // } else {
      //   return ''
      // }
      if (!this.lastFa) return ''
      return this.lastFa.id
    }
  },
  watch: {
    config(val) {
      this.bindKeys()
    },
    batchAppendInputList(val) {
      this.$emit('batchRuleChange', this.$copy(val))
    },
    batchId(val) {
      this.$set(this.searchForms, 'lotId', val)
      this.hanldeSubmit()
    }
  },
  created() {
    this.bindKeys()
    if (this.config.find(v => v.type === 'warehouseAreaCode')) {
      this.initData()
    }
  },
  methods: {
    /** 批次规则修改 */
    handleBatchRuleChange(val, val2) {
      /*
      1. 校验是否有多个父级，无，正常处理
      */
      let fas = [...new Set(val.map(v => v[0]))]
      if (fas.length === 2) {
        // debugger
        // 删除上一个父级选中的所有项
        // debugger
        let newNode = val.filter(v => v[0] !== this.lastFa)[0]
        // this.batchRule = newNode.length == 1 ? [newNode] :
        this.batchRule = [newNode]
        if (newNode.length == 2) {

          this.$nextTick(() => {
            this.batchRule = [[newNode[0]], newNode]
          })
        }
        this.lastFa = newNode[0]
      } else if (fas.length === 1) {
        if (!val.find(v => v.length === 1)) {
          if (this.lastFa) {
            // 删除了父节点
            this.batchRule = []
            this.lastFa = null
          } else {
            // 新加子节点
            this.batchRule = [...val, [val[0][0]]]
            this.lastFa = val[0][0]
          }
        } else if (val.length === 1 && val[0].length === 2) {
          this.batchRule = [val[0], [val[0][0]]]
          this.lastFa = fas[0]
        } else {
          this.lastFa = fas[0]
        }
      } else {
        this.lastFa = null
      }
    },
    initData() {
      this.getSelectInventoryAreaListLoading = true
      getSelectInventoryAreaList({ warehouseCode: this.chooseWarehouse }).then(res => {
        if (!res) return
        this.getSelectInventoryAreaListLoading = false
        this.warehouseArea = res.data
      })
    },
    /** 库区修改 */
    warehouseAreaCodeChange(val) {
      this.searchForms.warehouseSpaceCode = ''
      this.getInventorySiteLoading = true
      warehouseSpaceSelect({
        pageNum: 1,
        pageSize: 9999,
        warehouseAreaCode: val,
        warehouseCode: this.chooseWarehouse
      }).then(res => {
        this.getInventorySiteLoading = false
        if (!res) return
        this.warehouseSpace = res.data.list || []
      })
    },
    bindKeys() {
      const query = this.$route.query
      this.config.forEach(v => {
        if (v.default !== undefined && v.default !== null) {
          this.$set(this.searchForms, v.prop, v.default)
        } else {
          this.$set(this.searchForms, v.prop, undefined)
        }
        if (query[v.prop] !== undefined && query[v.prop] !== null) {
          this.$set(this.searchForms, v.prop, query[v.prop] + '')
        }
      })
    },
    hanldeSubmit() {
      this.submitLoading = true
      let searchForms = { ...this.searchForms }
      // 获取需要解析的字段, 针对 范围型数据
      if (this.configRange.length) {
        this.configRange.forEach(({ prop, props }) => {
          let valArr = searchForms[prop]
          delete searchForms[prop]
          if (valArr && valArr.length === 2) {
            searchForms[props[0]] = new Date(valArr[0]).getTime()
            searchForms[props[1]] = new Date(valArr[1]).getTime()
          }
        })
      }
      this.$emit('search', this.paramsTrim(searchForms), () => {
        this.submitLoading = false
      })
    },
    hanldeResetForm() {
      this.resetLoading = true
      this.$refs['searchForm'].resetFields()
      this.config.forEach(v => {
        this.$set(this.searchForms, v.prop, undefined)
      })
      this.batchRule = []
      this.$nextTick(() => {
        this.$emit('search', this.paramsTrim(this.searchForms), () => {
          this.resetLoading = false
        })
      })
    },
    /** 对字符串进行 去空格操作 */
    paramsTrim(form) {
      let temp = { ...form }
      Object.keys(temp).forEach(key => {
        let val = temp[key]
        if (typeof val === 'string') {
          temp[key] = temp[key].trim()
        }
      })
      return temp
    }
  }
}
</script>
