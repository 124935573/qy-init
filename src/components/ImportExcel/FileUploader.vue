<template>
  <el-upload
    ref="uploadRef"
    class="upload-file"
    accept=".xls, .xlsx"
    :name="name"
    :data="data"
    :headers="headers"
    :action="uploadApi"
    :disabled="disabled"
    :limit="limit"
    :show-file-list="false"
    :file-list="fileList"
    :on-exceed="handleExceed"
    :on-change="handleChange"
    :on-error="handleUploadError"
    :on-progress="handleProgress"
    :on-success="handleUploadSuccess"
    :before-upload="handleBeforeUpload"
  >
    <el-button v-if="fileList.length<limit" size="small" :type="uploadPercentage?'warning':'primary'" class="btn-upload">
      {{ uploadPercentage?'正在导入数据，请耐心等待...':'点击导入文件' }}
    </el-button>
    <div v-if="fileList.length">
      <strong>以下文件已导入成功</strong>
    </div>
    <ul v-if="fileList.length" class="el-upload-list el-upload-list--text" @click="maskClick">
      <li v-for="(file,index) in fileList" :key="index" class="el-upload-list__item is-success">
        <a class="el-upload-list__item-name">
          <i class="el-icon-document" /> {{ file.name }}
        </a>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-circle-check" />
        </label>
        <i class="el-icon-close" @click="handleBeforeRemove(file)" />
      </li>
    </ul>
    <div v-show="!fileList.length" slot="tip" class="el-upload__tip">只能上传.xls, .xlsx文件，且不超过{{ fileSize / 1024 /1024 }} M</div>
    <div v-if="uploadPercentage" class="mask-upload" @click="maskClick">
      <el-progress
        :percentage="uploadPercentage"
        :status="uploadStatus"
      />
      <div class="btn-cancel">
        <span v-if="cancelStatus" @click.stop="cancelUploadFile"><i class="el-icon-close" /></span>
        <span v-if="clearStatus" @click.stop="clearUploadStatus"><i class="el-icon-close" /></span>
      </div>
    </div>
  </el-upload>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'FileUploader',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    action: {
      type: String,
      default: () => `/api/v2/file/upload` // 附件默认上传路径
    },
    name: {
      type: String,
      default: 'file'
    },
    limit: {
      type: Number,
      default: 1
    },
    fileSize: {
      type: Number,
      default: 1024 * 1024 * 100
    },
    fileUrl: {
      type: String,
      default: ''
    },
    uploadTitle: {
      type: String,
      default: ''
    },
    beforeUpload: {
      type: Function,
      default: function() {
        return true
      }
    },
    beforeRemove: {
      type: Function,
      default: function() {
        return true
      }
    }
  },
  inject: {
    // 获取父组件的provide
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    return {
      headers: {
        // 文件上传请求头
        'X-Token': this.$store.getters.token ? getToken() : '',
        'Authorization': this.$store.getters.token ? 'Bearer ' + getToken() : ''
      },
      fileList: [],
      cancelStatus: false, // 是否需要取消上传
      clearStatus: false, // 是否可以清除组件上传状态
      uploadPercentage: 0, // 上传百分比
      uploadStatus: '' // 上传是否失败，失败时会设置为 exception
    }
  },
  computed: {
    uploadApi() {
      return `${process.env.VUE_APP_BASE_API}${this.action}`
    }
  },
  created() {},
  methods: {
    handleBeforeUpload: function(file) {
      // 上传前校验
      const accept = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      var isExcel = accept.includes(file.type)
      var isLt2M = file.size < this.fileSize
      if (!isExcel) {
        this.$message.error('只能上传EXCEL文件!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 ' + (this.fileSize / 1024 / 1024) + 'M!')
      }
      if (isExcel && isLt2M) {
        return this.beforeUpload(file)
      } else {
        return false
      }
    },
    handleProgress(event, file) {
      this.cancelStatus = true // 展示中断按钮
      // 上传中 event.percent 百分比
      this.uploadStatus = '' // 上传状态置空,
      this.uploadPercentage = parseFloat(event.percent.toFixed(1))
      if (this.uploadPercentage > 99) {
        this.uploadPercentage = 99.0
      }
    },
    handleUploadSuccess(response, file) {
      this.cancelStatus = false // 隐藏取消按钮
      // 上传成功回调
      if (response.success === 1) {
        this.uploadPercentage = 0// 上传进度归零, 隐藏进度框
        const fileData = {
          imageUrl: (response.data && response.data.fileUrl) || '', // 返回本地图片路径，不要取服务器返回对象的attachmentPath,会导致重新加载
          msg: (response.data && response.data.fileUrl) || '',
          fileSize: (response.data && response.data.fileSize) || 0
        }
        this.fileList.push({
          name: file.name,
          url: (response.data && response.data.fileUrl) || ''
        })
        this.$emit('upload-success', fileData)
      } else {
        if (response.code === 401 || response.code === '401' || response.status === 401) {
          this.refreshToken({}, () => {
            this.refreshHeaders()
          })
        } else {
          this.uploadStatus = 'exception'
          this.$message.error('上传失败: ' + response.msg)
          this.clearStatus = true
        }
        this.$refs.uploadRef.clearFiles()
      }
      this.$emit('upload-finish', response)
    },
    handleUploadError(err, file) {
      // 上传失败
      const res = JSON.parse(JSON.stringify(err))
      if (res.code === 401 || res.code === '401' || res.status === 401) {
        this.refreshToken({}, () => {
          this.refreshHeaders()
        })
      } else {
        this.$message.error('上传失败: ' + err)
        this.uploadStatus = 'exception'
        this.clearStatus = true
      }
      this.$refs.uploadRef.clearFiles()
    },
    handleChange(file) {
      this.$emit('on-change', '')
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多只能上传 ${this.limit} 个文件`)
    },
    clearUploadFile() {
      this.uploadStatus = ''
      this.uploadPercentage = 0
      this.cancelStatus = false
      this.clearStatus = false
      this.$refs.uploadRef.clearFiles()
    },
    /**
       *@methods:clearUploadStatus
       *@description: 当上传失败时清空上传组件里面的状态值
       **/
    clearUploadStatus() {
      this.uploadPercentage = 0
      this.clearStatus = false
      this.clearUploadFile()
    },
    /**
       *@methods:cancelUploadFile
       *@description:点击取消按钮 触发中断事件
       **/
    cancelUploadFile() {
      this.$refs.uploadRef.abort()
      this.uploadPercentage = 0
      this.$message({
        type: 'success',
        message: '上传已中断,请重新上传图片'
      })
      this.clearUploadFile()
    },
    maskClick(event) {
      // 阻止默认的文件弹出框
      event.stopImmediatePropagation()
    },
    handleBeforeRemove(file) {
      const before = this.beforeRemove()
      if (before && before.then) {
        before.then(() => {
          this.onRemove(file)
        })
      } else if (before !== false) {
        this.onRemove(file)
      }
    },
    onRemove(file) {
      const index = this.fileList.findIndex(v => v.url === file.url)
      if (index > -1) {
        this.fileList.splice(index, 1)
      }
      this.$emit('remove')
    },
    refreshHeaders() {
      this.headers = {
        'X-Token': this.$store.getters.token ? getToken() : '',
        'Authorization': this.$store.getters.token ? 'Bearer ' + getToken() : ''
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  .upload-file{
    position: relative;
    line-height: 30px;
    /deep/.el-upload{
      width: 100%;
      text-align: left;
    }
    .btn-upload{
      margin-bottom: 10px;
    }
  }
  .mask-upload{
    position: absolute;
    left: 0;
    top: 0;
    right:0;
    bottom:0;
    background: rgba($color: #000000, $alpha: 0);
    text-align: center;
    padding-top: 35px;
    padding-right:35px;
    .btn-cancel{
      position: absolute;
      right: 10px;
      top: 25px;
    }
  }
</style>
