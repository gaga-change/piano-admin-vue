<template>
  <div class="SetSpaceRuleDialog">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      title="空闲时段"
      :visible="visible"
      width="70%"
      :before-close="handleClose"
      @close="close"
    >
      <div v-loading="initLoading">
        <el-form
          :inline="true"
          :model="formData"
          label-width="100px"
          ref="form"
        >
          <div
            v-for="(item, index) in this.formData.spaceRules"
            :key="index"
          >
            <item-title :text="WEEK[index]">
              <el-link
                type="primary"
                class="ml15"
                @click="addArea(item, index)"
              >
                增加
              </el-link>
            </item-title>
            <el-form-item
              label=""
              :prop="`spaceRules.${index}.areas.${i}.value`"
              v-for="(area, i) in item.areas"
              :key="i"
              :rules="rulesArea"
            >
              <el-time-picker
                is-range
                v-model="area.value"
                format='HH:mm'
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              >
              </el-time-picker>
              <i
                class="el-icon-close close-btn"
                @click="delArea(item, index, area, i)"
              ></i>

            </el-form-item>
          </div>

        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="close()">取 消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="confirm()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const WEEK = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const turnDate = date => {
  const d = new Date(date)
  return Number(`${d.getHours()}.${d.getMinutes() > 10 ? d.getMinutes() : ('0' + d.getMinutes())}`)
}
import { spaceRulesAdd, spaceRulesDel, spaceRulesList } from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    /** 数据初始 */
    row: {
      type: Object,
      default: () => null
    },
    type: {
      type: String,
      default: 'teacher',
    }
  },
  computed: {
    /** 防止父级传递 null */
    rowData() {
      return this.row || {}
    }
  },
  watch: {
    /** 监听数据切换，重置表单。为何不监听rowData?因为主组件visible一一对应，但选中数据不是，selectRow 是多个弹窗共享的 */
    visible(val) {
      if (!val) return
      // Object.keys(this.formData).forEach(key => {
      //   this.$set(this.formData, key, this.rowData[key] === null ? undefined : this.rowData[key])
      // })
    }
  },
  data() {
    var check = (rule, value, callback) => {
      // 校验相邻是否冲突
      //"spaceRules.0.areas.1.value"
      let errMsg = '时间范围存在冲突'
      console.log('check ### ', value, rule)
      if (!value || value.length !== 2) {
        return callback()
      }
      const index = Number(/spaceRules.(\d).areas/.exec(rule.fullField)[1])
      const i = Number(/areas.(\d).value/.exec(rule.fullField)[1])
      value = [turnDate(value[0]), turnDate(value[1])]

      const check = this.formData.spaceRules[index].areas.some((item, _i) => {

        if (_i === i) return false
        let _v = item.value
        if (!_v || _v.length !== 2) {
          return false
        }
        _v = [turnDate(_v[0]), turnDate(_v[1])]
        // console.log(value, _v)
        console.log(_v[1] === value[0], _v[0] === value[1], _v, value)
        if ((_v[1] === value[0])
          || (_v[0] === value[1])) {
          errMsg = "有相连的时间范围，需合并成一个"
          return true
        }
        if ((_v[1] > value[0] && _v[1] < value[1])
          || (value[1] > _v[0] && value[1] < _v[1])
          || (value[1] === _v[1] && value[0] === _v[0]) // 相等
          || (value[0] < _v[0] && value[1] > _v[1]) // value 含 _v1
          || (value[0] > _v[0] && value[1] < _v[1]) // _v1 含 value
        ) {
          return true
        }
      })
      console.log('chekc', check)
      if (check) {
        callback(errMsg)
      } else
        callback()
    }
    return {
      WEEK,
      loading: false,
      initLoading: true,
      formData: {
        //  ... 表单字段
        spaceRules: [],
      },
      keySpaceRule: {},
      oldAreas: [],
      rulesArea: [
        {
          required: true, message: '时间区域不能为空', trigger: 'blur'
        },
        {
          validator: check,
          trigger: ['submit']
        }
      ],
    }
  },
  created() {
    for (let i = 0; i < 7; i++) {
      this.formData.spaceRules.push({
        areas: []
      })
    }
    this.init()
  },
  methods: {
    // 初始化，恢复时间区间
    init() {
      this.initLoading = true
      const params = {}
      params[this.type] = this.rowData._id
      spaceRulesList(params).then(res => {
        this.initLoading = false
        if (!res) return
        console.log(res.list)
        this.oldAreas = []
        this.keySpaceRule = {}
        res.list.forEach(item => {
          const key = `${item.week}-${turnDate(item.startTime)}-${turnDate(item.endTime)}`
          this.oldAreas.push({
            txt: key,
            value: [new Date(item.startTime), new Date(item.endTime)],
            week: item.week
          })
          this.keySpaceRule[key] = item
          // 回填表单
          const areas = this.formData.spaceRules[item.week - 1].areas
          areas.push({
            value: [new Date(item.startTime), new Date(item.endTime)]
          })
        })
      })
    },
    /** 增加时间段 */
    addArea(item, index) {
      item.areas.push({
        value: null
      })
    },
    /** 删除时间段 */
    delArea(item, index, area, i) {
      item.areas.splice(i, 1)
    },
    /** 确定 */
    confirm() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          let newAreas = [] // {txt: '${week}-20.01-21:12', value: [date1, date2], week: 1}
          let oldAreas = [...this.oldAreas] // {txt: '${week}-20.01-21:12', value: [date1, date2]}
          let keySpaceRule = { ...this.keySpaceRule } // '{${week}-20.01-21:12: obj}' 
          this.formData.spaceRules.forEach((item, index) => {
            item.areas.forEach((area) => {
              newAreas.push({
                txt: `${index + 1}-${turnDate(area.value[0])}-${turnDate(area.value[1])}`,
                value: [...area.value],
                week: index + 1
              })
            })
          })
          let newAreasTxt = newAreas.map(v => v.txt)
          let oldAreasTxt = oldAreas.map(v => v.txt)
          // 获取被删除的列表  初始的时间段在当前中没有
          let delArr = []
          oldAreas.forEach(item => {
            if (!newAreasTxt.includes(item.txt)) {
              delArr.push(keySpaceRule[item.txt])
            }
          })
          console.log('被删除的 ', delArr)
          for (let i = 0; i < delArr.length; i++) {
            let item = delArr[i]
            await spaceRulesDel(item._id)
          }
          // 获取新增的列表  当前的时间段在初始中没有
          let addArr = []
          newAreas.forEach(item => {
            if (!oldAreasTxt.includes(item.txt)) {
              addArr.push(item)
            }
          })
          console.log('新增的 ', addArr)
          for (let i = 0; i < addArr.length; i++) {
            let item = addArr[i]
            const params = {
              startTime: item.value[0],
              endTime: item.value[1],
              week: item.week,
            }
            params[this.type] = this.rowData._id
            await spaceRulesAdd(params)
          }
          this.loading = false
          return
          this.loading = true
          let promiseArr = []
          this.formData.spaceRules.forEach((item, index) => {
            item.areas.forEach((area) => {
              const params = {
                startTime: area.value[0],
                endTime: area.value[1],
                week: index + 1,
              }
              params[this.type] = this.rowData._id
              let temp = spaceRulesAdd(params).then(res => {

              })
              promiseArr.push(temp)
            })
          })
          Promise.all(promiseArr).then(() => {
            this.loading = false
          })
        }
      })
    },
    /** 关闭弹窗 */
    close() {
      // 初始化表单
      // this.$refs['form'] && this.$refs['form'].resetFields()
      // 初始化没有挂载到表单的数据
      // ...
      this.visible && this.$emit('update:visible', false)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    }
  }
}
</script>

<style lang="scss">
.SetSpaceRuleDialog {
  .close-btn {
    position: absolute;
    right: -7px;
    top: -7px;
    color: red;
    cursor: pointer;
    font-size: 14px;
    border: 1px solid;
    border-radius: 10px;
    background-color: #fff;
  }
}
</style>