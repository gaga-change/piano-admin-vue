<template>
  <div class="BatchForm">
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="100px"
      class="demo-dynamic"
      :inline="true"
    >
      <el-form-item
        prop="lotName"
        label="批次描述"
        :rules="[
      { required: true, message: '请输入批次描述', trigger: ['blur', 'change'] },
    ]"
      >
        <el-input
          style="width:200px"
          placeholder="请输入批次描述"
          maxlength="30"
          v-model="dynamicValidateForm.lotName"
        ></el-input>
      </el-form-item>
      <table class="input-table">
        <tr>
          <th>序号</th>
          <th>批次属性</th>
          <th>输入类型</th>
          <th>属性选项</th>
          <th>启用</th>
          <th>系统采集</th>
          <th>映射属性</th>
          <th>输入控制</th>
        </tr>
        <tr
          v-for="(item , index) in dynamicValidateForm.propItems"
          :key="item.key"
        >
          <td>{{index + 1}}</td>
          <td>
            <el-form-item
              label=""
              :class="{error:  item.status === 0}"
              :prop="'propItems.' + index + '.lotAttrName'"
              :rules="[
      { required: item.status === 0, message: '已启用，请输入批次属性', trigger: ['blur', 'change']  },
    ]"
            >
              <el-input
                style="width:200px;"
                v-model="item.lotAttrName"
                maxlength="20"
                :disabled="index < 2"
                placeholder="批次属性"
              ></el-input>
            </el-form-item>
          </td>
          <td>
            <el-form-item
              label=""
              :prop="'propItems.' + index + '.lotAttrType'"
            >
              <el-select
                :disabled="index < 2"
                v-model="item.lotAttrType"
                placeholder="请选择输入类型"
                style="width:110px"
              >
                <el-option
                  v-for="item in mapConfig.lotAttrTypeEnum || []"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td>
            <template v-if="item.lotAttrType === 1">
              <el-form-item
                label="最大长度"
                :prop="'propItems.' + index + '.length'"
              >
                <el-input-number
                  placeholder="最大长度"
                  v-model="item.length"
                  :precision="0"
                  :min="1"
                  :max="50"
                  :disabled="index < 2"
                  controls-position="right"
                ></el-input-number>
              </el-form-item>
            </template>
            <template v-else-if="item.lotAttrType === 2">
              <el-form-item
                label-width="50px"
                label="最小值"
                :prop="'propItems.' + index + '.min'"
              >
                <el-input-number
                  placeholder="最小值"
                  v-model="item.min"
                  :precision="0"
                  :min="-999999"
                  :max="999999"
                  controls-position="right"
                  style="width:120px"
                  :disabled="index < 2"
                ></el-input-number>
              </el-form-item>
              <el-form-item
                label-width="50px"
                label="最大值"
                :prop="'propItems.' + index + '.max'"
              >
                <el-input-number
                  placeholder="最大值"
                  v-model="item.max"
                  :precision="0"
                  :min="-999999"
                  :max="999999"
                  controls-position="right"
                  style="width:120px"
                  :disabled="index < 2"
                ></el-input-number>
              </el-form-item>
              <el-form-item
                label-width="50px"
                label="精度"
                :prop="'propItems.' + index + '.precision'"
              >
                <el-input-number
                  placeholder="精度"
                  v-model="item.precision"
                  :precision="0"
                  :min="0"
                  :max="5"
                  controls-position="right"
                  style="width:100px"
                  :disabled="index < 2"
                ></el-input-number>
              </el-form-item>
            </template>
            <template>
              <el-form-item
                v-show="item.lotAttrType === 3"
                label="枚举值"
                :prop="'propItems.' + index + '.enum'"
                :rules="[
      { required: item.lotAttrType === 3 && item.status === 0, message: '必填项', trigger: ['blur', 'change']  },
    ]"
              >
                <el-input
                  style="width:200px;"
                  v-model="item.enum"
                  maxlength="200"
                  placeholder="例如：值1/值2"
                ></el-input>
              </el-form-item>
            </template>
            <template>
              <el-form-item
                v-show="item.lotAttrType === 4"
                label="日期格式"
                :prop="'propItems.' + index + '.format'"
              >
                <el-select
                  v-model="item.format"
                  placeholder="请选择日期格式"
                >
                  <el-option
                    v-for="item in formatArr"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </td>
          <td>
            <el-form-item
              label=""
              :prop="'propItems.' + index + '.status'"
            >
              <el-switch
                v-model="item.status"
                :active-value='0'
                :inactive-value='1'
                @change="val => handleStatusChange(val, item, index)"
              >
              </el-switch>
            </el-form-item>
          </td>
          <td>
            <el-form-item
              label=""
              :prop="'propItems.' + index + '.dataSource'"
            >
              <el-select
                v-model="item.dataSource"
                placeholder=""
                :disabled="index < 2"
                style="width:80px"
              >
                <el-option
                  v-for="item in mapConfig.noRrYesEnum || []"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td>
            <el-form-item
              v-show="item.dataSource === 0"
              label=""
              :prop="'propItems.' + index + '.receiveOrderAttr'"
              :rules="[
      { required: item.dataSource === 0, message: '必填项', trigger: ['blur', 'change']  },
    ]"
            >
              <el-select
                v-model="item.receiveOrderAttr"
                :disabled="index < 2"
                clearable
              >
                <el-option
                  v-for="item in mapConfig.receiveOrderAttrEnum || []"
                  :key="item.value"
                  :disabled="!!~receiveOrderAttrSelectedArr.indexOf(item.value)"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td>
            <el-form-item
              label=""
              :prop="'propItems.' + index + '.inputType'"
            >
              <el-select
                v-model="item.inputType"
                placeholder=""
                style="width:80px"
              >
                <el-option
                  v-for="item in mapConfig.inputTypeEnum || []"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
        </tr>
      </table>
      <el-alert
        class="mt15"
        title="温馨提示："
        type="info"
        :closable="false"
      >
        <p>1、自定义字段为收货节点人工补录时，信息系统采集选否</p>
        <p>2、自定义字段从收货单采集时，信息系统采集选是，且需选择映射属性</p>
      </el-alert>
      <div class="mt20">
        <el-form-item>
          <el-button
            :loading="addLotLoading"
            type="primary"
            @click="submitForm('dynamicValidateForm')"
          >提交</el-button>
          <el-button
            :disabled="addLotLoading"
            @click="resetForm('dynamicValidateForm')"
          >重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

//  "lotAttrCode": "string //属性编码 lotAttr01-lotAttr12 12个属性值",
//  "lotAttrName": "string //属性名字",
//  "dataSource": "int //采集来源 0 : 系统采集 1：用户录入",
//       "status": "int //状态 0 : 启用  1：禁用",
//       "inputType": "int //输入控制 0:可选 1:必输 2:只读 如果只读则设置 lot_attr_value 值",
//       "lotAttrType": "int //属性类型 1:文本 2:数字 3:下拉 4:日期",
//       "lotAttrValue": "string //属性选项 如果属性格式为下拉则用于配置枚举类型，如：正品/残次品，是否;如果输入控制为必输则设置对应的默认值",
//       "isBatch": "int //是否为批次号属性:0:否 1:是\r      根据批次属性组合生成 唯一批次号",
//       "receiveOrderAttr": "string //关联的收货单中对应的属性，如果data_source\u003d0则该值必输",
//       "receiveOrderDetailAttr": "string //关关联的收货单中对应的属性，如果data_source\u003d0则该值必输",
//       "remark": "string //备注"
import { cloneDeep, omit, pick } from 'lodash';
import { addLot } from '@/api'
export default {
  data() {
    return {
      addLotLoading: false,
      dynamicValidateForm: {
        propItems: [{
          lotAttrName: '',
          lotAttrType: 1,
          status: 1,
          dataSource: 1,
          inputType: 0,
          length: 20, // 长度
          min: 0, // 最小值
          max: 99999999, // 最大值
          precision: 0, // 精度
          enum: undefined, // 枚举值
          format: 'YYYY-MM-DD', // 日期格式
          receiveOrderAttr: '', // 映射属性
        }],
        lotName: undefined
      },
      // formatArr: ['YYYY', 'YYYY-MM', 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'],
      formatArr: ['YYYY', 'YYYY-MM', 'YYYY-MM-DD'],
    };
  },
  computed: {
    ...mapGetters([
      'mapConfig',
      'visitedViews'
    ]),
    receiveOrderAttrSelectedArr() {
      return this.dynamicValidateForm.propItems.map(v => v.receiveOrderAttr).filter(v => v)
    }

  },
  created() {
    let item = this.dynamicValidateForm.propItems[0]
    this.dynamicValidateForm.propItems = []
    for (let i = 0; i < 12; i++) {
      let temp = cloneDeep(item)
      temp.key = Date.now().toString(16) + i
      if (i === 0) {
        temp.lotAttrName = '供应商'
        temp.dataSource = 0
        temp.receiveOrderAttr = 'providerCode'
      }
      if (i === 1) {
        temp.lotAttrName = '保质天数'
        temp.lotAttrType = 2
      }
      this.dynamicValidateForm.propItems.push(temp)
    }
  },
  methods: {
    // 监听状态改变，重新校验 属性名称规则是否必输
    handleStatusChange(val, item, index) {
      if (val === 1) { // 不启用，取消必填提示
        this.$nextTick(() => {
          this.$refs['dynamicValidateForm'].validateField('propItems.' + index + '.lotAttrName')
        })
      }
    },
    submitForm(formName) {
      const view = this.visitedViews.filter(v => v.path === this.$route.path)
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        let data = cloneDeep(this.dynamicValidateForm)
        let params = {
          lotName: data.lotName
        }
        let useNum = 0
        params.lotDetailReqList = data.propItems.map((v, index) => {
          if (v.status === 0) useNum++
          let temp = pick(v, ['length', 'min', 'max', 'precision', 'enum', 'format'])
          if (temp.enum) {
            temp.enum = temp.enum.split('/')
            // 去重 去空
            temp.enum = temp.enum.filter(v => v)
            temp.enum = [...new Set(temp.enum)]
          }
          return {
            ...omit(v, ['length', 'min', 'max', 'precision', 'enum', 'format']),
            lotAttrValue: JSON.stringify(temp),
            lotAttrCode: 'lotAttrCode' + (index + 1)
          }
        })
        if (!useNum) {
          return this.$message.error('至少一个启用的批次属性')
        }
        this.addLotLoading = true
        addLot(params).then(res => {
          if (!res) {
            this.addLotLoading = false
            return
          }
          this.$message.success('批次创建成功，即将跳转到批次列表！')
          setTimeout(() => {
            this.$store.dispatch('delVisitedViews', view[0]).then(() => {
              this.$router.push({
                path: `/businessRule/batchList`
              })
            }).catch(err => {
            })
          }, 3000)
        })

      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      });
    }
  }
}
</script>
<style lang="scss">
.BatchForm {
  .input-table {
    width: 100%;
    font-size: 0;
    color: #606266;
    // border: 1px solid;
    border: 1px solid #ebeef5;
    border-right: none;
    border-bottom: none;
    border-collapse: collapse;
    th,
    td {
      font-size: 14px;
      padding: 5px 0;
      border-bottom: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      text-align: center;
      .el-form-item {
        margin: 0;
        &.is-error {
          margin-bottom: 18px;
        }
      }
    }
    th {
      font-weight: normal;
    }
  }
}
</style>