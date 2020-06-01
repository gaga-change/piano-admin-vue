<template>
  <div class="">
    <!-- 600px【小型，单列】 70% 【中型，双列】-->
    <el-dialog
      :title="`${rowData._id ? '修改' : '新建'}课类型`"
      :visible="visible"
      width="400px"
      :before-close="handleClose"
      @close="close"
    >
      <div>
        <base-form
          :config="formConfig"
          :rules="rules"
          ref="form"
        > </base-form>
      </div>
      <!-- <el-alert
        class="mt15"
        title="温馨提示："
        type="info"
        :closable="false"
      >
        <p>举例，商品最小单位默认为1,4个最小单位为一个内包装【一个内包装数量为4】，
          2个内包装为1箱【一箱数量8】，10箱为一个容器【一容器数量为80】</p>
      </el-alert> -->
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
const formConfig = [
  { label: "名称", prop: "name", width: 120 },
  { label: "状态", prop: "disabled", type: "enum", enum: "disabledEnum", default: false },
  { label: "备注", prop: "remark" }
];
const rules = {
  name: [
    { required: true, message: "必填项", trigger: ["blur", "change"] }
  ],
};
/**
 * 父级设置
 * <dialog
      :visible.sync="dialogVisible"
      :row="selectedRow"
      @submited="getTableData()"
    />
 */
import { classTypesAdd, classTypesModify } from "@/api";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    /** 数据初始 */
    row: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    /** 防止父级传递 null */
    rowData() {
      return this.row || {};
    }
  },
  watch: {
    /** 监听数据切换，重置表单 */
    visible(val) {
      if (!val) return;
      this.formConfig.forEach(item => {
        item.default =
          (this.rowData[item.prop] === null || this.rowData[item.prop] === undefined)
            ? item.default
            : this.rowData[item.prop];

      });

      this.$nextTick(() => {
        this.$refs["form"].init();
      });
    }
  },
  data() {
    return {
      formConfig,
      rules,
      loading: false
    };
  },
  methods: {
    /** 确定 */
    confirm() {
      const isModify = this.row && this.row._id;
      const api = isModify ? classTypesModify : classTypesAdd;
      this.$refs["form"].validate((valid, params) => {
        if (valid) {
          this.loading = true;
          let temp = isModify ? [this.row._id, params] : [params];
          api(...temp).then(res => {
            this.loading = false;
            if (!res) return;
            this.$message.success("操作成功！");
            this.$emit("submited");
            this.close();
          });
        }
      });
    },
    /** 关闭弹窗 */
    close() {
      // 初始化表单
      // 初始化没有挂载到表单的数据
      // ...
      this.visible && this.$emit("update:visible", false);
    },
    handleClose(done) {
      if (this.visible === false) {
        return done()
      }
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => { });
    }
  }
};
</script>