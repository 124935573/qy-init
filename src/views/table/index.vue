<template>
  <div class="componentType unifiedBg">
    <table-box
      ref="componentTypeTable"
      :selected-arry.sync="tableSelected"
      :table-config="tableConfig"
      @btnOperate="btnOperate"
    />

    <!-- 新增/编辑 -->
    <el-dialog
      width="700px"
      :title="editDlg.title"
      :visible.sync="editDlg.show"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="editForm" label-width="110px" size="mini" :model="editDlg.form" :rules="editDlg.rules">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="组件类型" prop="atblDescription">
              <el-input v-model.trim="editDlg.form.atblDescription" placeholder="请输入组件类型" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="组件类型编码" prop="atblCode">
              <el-input v-model.trim="editDlg.form.atblCode" placeholder="请输入组件类型编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="是否启用" prop="atblActive" required>
              <el-select v-model="editDlg.form.atblActive" placeholder="请选择是否启用">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editDlg.show = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveSettings">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  removeItem,
  saveItem
} from '@/api/table'
export default {
  name: 'ComponentType',
  data() {
    const checkDigits = (rule, value, callback) => {
      var regex = /^[A-Z]$/
      if (value && !regex.test(value)) {
        callback(new Error('校验是否为一个大写英文字母'))
      } else if (value == null || value === '') {
        callback(new Error('请输入组件类型编码'))
      } else {
        callback()
      }
    }
    return {
      tableSelected: [],
      addFlag: true,
      tableConfig: {
        interfacePath: `${process.env.VUE_APP_BASE_API}/api/v2/user/page`,
        pageSize: 20,
        tablePage: [20, 40, 60, 100],
        setting: [{
          prop: 'atblDescription',
          label: '组件类型',
          type: 'picklist',
          propInterface: `${process.env.VUE_APP_BASE_API}/api/Common/GetStatusListByModuleName?moduleName=PartType`
        },
        {
          prop: 'atblCode',
          label: '组件类型编码'
        },
        {
          prop: 'userName',
          label: '用户姓名',
          minWidth: 100
        },
        {
          prop: 'account',
          label: '用户名',
          minWidth: 120
        },
        {
          prop: 'state',
          label: '状态',
          width: '100',
          type: 'select',
          propEnum: {
            domainCode: 'platform',
            appCode: 'ucenter',
            dictTypeCode: 'QUP_USER_STATE'
          },
          render: function(createElement, rows) {
            if (rows.state === 1 || rows.state === 0) {
              return (<div>
                <svg-icon class={rows.state === 1 ? 'icon-on' : 'icon-off'}
                  icon-class={rows.state === 1 ? 'zhengquewancheng-line' : 'jinzhi'}></svg-icon>
                {rows.state === 1 ? '启用' : rows.state === -1 ? '失效' : '停用' }
              </div>
              )
            }
            return ''
          }
        },
        {
          prop: 'userType',
          label: '用户类型',
          minWidth: 120,
          type: 'select',
          propEnum: {
            domainCode: 'platform',
            appCode: 'ucenter',
            dictTypeCode: 'QUP_CUSTOMER_TYPE'
          }
        },
        {
          prop: 'createBy',
          label: '创建人'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'date'
        }
        ],
        btnList: [{
          buttonName: '新增',
          optCode: 'add',
          outerFlag: true
        }, {
          buttonName: '修改',
          optCode: 'edit',
          outerFlag: true
        }, {
          buttonName: '删除',
          optCode: 'del',
          outerFlag: true
        }]
      },
      editDlg: {
        show: false,
        title: '',
        form: {
          atblDescription: null,
          atblCode: null,
          atblActive: 1
        },
        rules: {
          atblDescription: [{
            required: true,
            message: '请输入组件类型'
          }],
          atblCode: [{
            required: true,
            validator: checkDigits
          }],
          atblActive: [{
            required: true,
            message: '请选择是否启用',
            trigger: 'blur'
          }]
        }
      }
    }
  },
  methods: {
    btnOperate(flag) {
      // 表格组件操作响应
      switch (flag) {
        case 'add':
          this.editDlg.form = {
            atblDescription: null,
            atblCode: null,
            atblActive: 1
          }
          this.addFlag = true
          setTimeout(() => {
            this.$refs.editForm && this.$refs.editForm.clearValidate()
          }, 0)
          this.editDlg.title = '新增'
          this.editDlg.show = true
          break
        case 'edit':
          this.addFlag = false
          if (!this.singleJudge(this.tableSelected, '修改', true)) {
            return
          }
          this.editDlg.form = JSON.parse(JSON.stringify(this.tableSelected[0]))
          this.editDlg.title = '修改'
          this.editDlg.show = true
          break
        case 'del':
          if (!this.singleJudge(this.tableSelected, '删除', true)) {
            return
          }
          this.$confirm('确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            removeItem({
              icalIds: this.tableSelected[0].atblID
            }).then(res => {
              this.$refs.componentTypeTable.initTableData()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
          })
          break
        default:
          break
      }
    },
    saveSettings() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          saveItem([Object.assign({
            atblID: this.addFlag ? 0 : this.tableSelected[0].atblID,
            atbID: 0
          },
          this.editDlg.form)]).then(res => {
            this.editDlg.show = false
            this.$refs.componentTypeTable.initTableData()
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
          })
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
  .el-select {
    width: 100% !important;
  }

</style>
