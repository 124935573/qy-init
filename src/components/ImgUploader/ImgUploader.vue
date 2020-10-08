<template>
  <el-upload
    ref="uploadRef"
    class="qup-img-uploader el-upload-list--picture-card"
    :style="{height:sizeStyle.height}"
    :name="file"
    auto-upload
    with-credentials
    accept="image/*"
    :data="data"
    :headers="headers"
    :action="action"
    :show-file-list="false"
    :on-change="handleChange"
    :disabled="uploadDisabled"
    :on-error="handleUploadError"
    :on-progress="handleProgress"
    :on-success="handleUploadSuccess"
    :before-upload="handleBeforeUpload"
  >
    <img v-if="!hideImg&&(imageUrl || privateImageUrl)" :src="imageUrl ? imageUrl : privateImageUrl" :style="sizeStyle">
    <i
      v-else-if="!imageUrl && !uploadPercentage"
      class="el-icon-plus uploader-border"
      :style="sizeStyle"
    ><span style="font-size: 14px;">{{ uploadTitle }}</span>
    </i>
    <el-progress
      v-else
      type="circle"
      :percentage="uploadPercentage"
      :status="uploadStatus"
      :style="progressStyle"
      :width="progressWidth"
    />
    <span v-if="cancelStatus" class="el-upload-list__item-actions" @click.stop="cancelUploadFile"><i class="el-icon-close" /></span>
    <span v-if="clearStatus" class="el-upload-list__item-actions" @click.stop="clearUploadStatus"><i class="el-icon-close" /></span>

    <span
      v-if="mask && (imageUrl || privateImageUrl)"
      class="el-upload-list__item-actions"
      :style="{borderRadius:sizeStyle.borderRadius}"
      @click="maskClick"
    >
      <span
        v-if="!uploadDisabled && deleteIcon"
        @click.stop="handleBeforeRemove"
      >
        <i class="el-icon-delete" />
      </span>
      <slot name="mask-btn" />
    </span>
  </el-upload>
</template>

<script>

/**
   * @name:图片上传组件
   * @createdby:yrf
   * @depend elementUI
   * @demo：<qup-img-uploader
   ui-type="rectangle"
   width="300"
   height="100"
   upload-title="选择图片"
   image-size="8192"
   @uploadsuccess="uploadSuccess"
   @remove=""
   >
   </qup-img-uploader>
   *      uploadSuccess: function(data){
   *          //获取附件id
                this.formData.attachmentId = data.newRow.id;
            },
   @action 文件上传的接口路径，默认是标准附件新建接口
   @data 除了文件额外需要提交的数据对象
   @name 上传文件的字段名，默认为标准附件接口的文件字段名
   @mask 上传图片后鼠标hover时是否显示遮罩，遮罩上可通过slot添加工具按钮，默认有删除按钮
   @delete-icon 是否显示遮罩上的删除按钮 默认为ture
   @ui-type：图片上传框风格，圆形：circle， 矩形：rectangle（默认）
   @width: 图片上传框宽度（直径），默认120
   @height：图片上传框高度：默认120
   @upload-title: 图片上传框内提示信息
   @image-size: 上传图片大小限制，默认10240（KB）
   @disabled：是否禁用 true/false（可用）
   @image-url: 要显示图片的URL
   @hide-img：是否隐藏图片的显示，true/false,默认false;设为true时，image-url将失效

   函数
   @before-upload 上传前调用函数，返回false或者promise且被reject不上传，参数为file
   @before-remove 删除前调用函数，返回false或promise且被reject不删除图片，无参

   事件
   @uploadsuccess: 上传成功回调函数(事件），参数为上传成功后服务端返回的response对象
   @uploadfinish: 上传接口返回数据后的回调函数，不一定成功（事件），参数为response对象
   @remove 点击默认删除按钮时的回调函数(事件)，无参数
   */
import { getToken } from '@/utils/auth'
// import { deleteFile } from '@/api/file'
export default {
  name: 'ImgUploader',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    action: {
      type: String,
      default: () => `${process.env.VUE_APP_BASE_API}/api/v2/file/upload` // 附件默认上传路径
    },
    name: {
      type: String,
      default: 'uploadAttachment'
    },
    uiType: {
      // 文件上传框风格 circle / rectangle
      type: String,
      required: false,
      default: 'rectangle'
    },
    width: {
      // 文件上传框高度, 若是圆形则取宽度作为直径
      type: Number,
      default: 120
    },
    height: {
      type: Number,
      default: 120
    },
    imageSize: {
      type: Number,
      default: 10240
    },
    hideImg: {
      type: Boolean,
      default: false
    },
    mask: Boolean, // 是否显示遮罩，true表示在有图片的时候显示遮罩，可在遮罩上添加各种按钮,默认有删除按钮
    stopDefaultFileDialog: { // 是否在点击遮罩非按钮区域时阻止事件冒泡，防止打开文件选择框
      type: Boolean,
      default: true
    },
    deleteIcon: {
      type: Boolean,
      default: true
    },
    imageUrl: {
      type: String,
      default: ''
    },
    relativeUrl: {
      type: String,
      default: ''
    },
    disabled: Boolean,
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
  inject: { // 获取父组件的provide
    elForm: { default: '' },
    elFormItem: { default: '' }
  },
  data: function() {
    return {
      headers: {
        // 文件上传请求头
        // Authorization: linkToken.getLocalToken()
        'X-Token': this.$store.getters.token ? getToken() : '',
        'Authorization': this.$store.getters.token ? 'Bearer ' + getToken() : ''
      },
      sizeStyle: {
        /* border: '1px dashed #d9d9d9',
          fontSize: '24px',
          color: '#8c939d',*/
        borderRadius: '0px'
      }, // 图片上传框样式
      progressStyle: { margin: '10px 10px' }, // 进度框样式
      progressWidth: 50, // 进度框宽度 --直径
      privateImageUrl: this.imageUrl, // 图片路径，privateImageUrl 为组件内图片变量，优先取父组件传入的图片变量，无则使用此路径变量，防止父组件上传图片后没有设置imageUrl
      uploadPercentage: 0, // 上传百分比
      uploadStatus: '', // 上传是否失败，失败时会设置为 exception
      CIRCLE: 'circle',
      RECTANGLE: 'rectangle',
      cancelStatus: false, // 是否需要取消上传
      clearStatus: false// 是否可以清除组件上传状态
    }
  },
  computed: {
    uploadDisabled() {
      return this.disabled || (this.elForm || {}).disabled // 通过上层表单元素是否禁用来确定当前是否禁用
    }
  },
  watch: {
    imageUrl: function(val) {
      this.privateImageUrl = val // 外部修改触发内部更新，但内部更新不完全依赖外部
    }
  },
  created: function() {
    if (this.uiType === this.CIRCLE) {
      // 圆形
      this.sizeStyle.height = this.width + 'px'
      this.sizeStyle.width = this.width + 'px'
      this.sizeStyle.borderRadius = this.width / 2 + 'px'
      this.sizeStyle.lineHeight = this.width + 'px'
      if (this.width < 100) {
        this.progressWidth = this.width - 10
        this.progressStyle.margin = '5px'
      } else {
        this.progressWidth = this.width >> 1
        this.progressStyle.margin = (this.width >> 2) + 'px'
      }
    } else if (this.uiType === this.RECTANGLE) {
      // 矩形
      this.sizeStyle.height = this.height + 'px'
      this.sizeStyle.width = this.width + 'px'
      this.sizeStyle.lineHeight = this.height + 'px'

      /** 计算进度框大小位置 */
      var d = (this.width > this.height ? this.height : this.width) - 20 // 直径 最小50才行, 所以宽高必须70
      var marginTop = (this.height - d) / 2
      var marginLeft = (this.width - d) / 2
      marginTop = marginTop > 0 ? marginTop : 0
      marginLeft = marginLeft > 0 ? marginLeft : 0
      this.progressWidth = d
      this.progressStyle.margin = marginTop + 'px ' + marginLeft + 'px'
    }
  },
  methods: {
    handleBeforeUpload: function(file) {
      this.refreshHeaders()
      // 上传前校验
      var isImg = file.type.indexOf('image/') > -1
      var isLt2M = file.size / 1024 < this.imageSize
      if (!isImg) {
        this.$message.error('只能上传图片文件!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 ' + this.imageSize + 'KB!')
      }
      if (isImg && isLt2M) {
        return this.beforeUpload(file)
      } else {
        return false
      }
    },
    handleUploadSuccess(response, file) {
      // 上传成功回调
      this.cancelStatus = false // 隐藏取消按钮
      if (response.success === 1) {
        this.privateImageUrl = URL.createObjectURL(file.raw)
        this.uploadPercentage = 0// 上传进度归零, 隐藏进度框
        response.imageUrl = this.privateImageUrl // 返回本地图片路径，不要取服务器返回对象的attachmentPath,会导致重新加载
        this.$emit('upload-success', response)
      } else {
        if (response.code === 401 || response.code === '401' || response.status === 401) {
          this.refreshToken({}, () => {
            this.refreshHeaders()
          })
        } else {
          this.$message.error('上传失败: ' + response.msg)
          this.uploadStatus = 'exception'
          this.clearStatus = true
        }
        this.$refs.uploadRef.clearFiles()
      }
      this.$emit('upload-finish', response)
    },
    handleProgress(event, file) {
      this.cancelStatus = true // 展示中断按钮
      // 上传中 event.percent 百分比
      // this.$emit('before-upload',file);//上传之前清空之前的图片url
      this.uploadStatus = '' // 上传状态置空,
      this.uploadPercentage = parseFloat(event.percent.toFixed(1))
      if (this.uploadPercentage > 99) {
        this.uploadPercentage = 99.0
      }
      this.privateImageUrl = ''
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
    /**
       *@createdBy 常九福
       *@date 2018/12/3
       *@methods:clearUploadStatus
       *@description: 当上传失败时清空上传组件里面的状态值
       **/
    clearUploadStatus() {
      this.uploadPercentage = 0
      this.clearStatus = false
    },
    /**
       *@createdBy 常九福
       *@date 2018/12/3
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
      this.cancelStatus = false
    },

    handleChange: function(file) {
      this.$emit('on-change', '')
    },
    handleBeforeRemove: function(file) {
      const before = this.beforeRemove()
      if (before && before.then) {
        before.then(
          () => {
            this.onRemove()
          })// 注意箭头函数作用域
      } else if (before !== false) {
        this.onRemove()
      }
    },

    /** 清除显示图片 */
    onRemove: function() {
      this.privateImageUrl = ''
      this.imageUrl = ''
      this.$emit('remove') // 点击删除
      /* if (this.relativeUrl) {
        deleteFile(this.relativeUrl).then(res => {

        }).catch(err => {
          console.log(err)
        })
      } */
    },
    maskClick(event) {
      // 阻止默认的文件弹出框
      if (this.stopDefaultFileDialog) {
        event.stopImmediatePropagation()
      }
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

<style scoped>
  /** 单图片上传组件样式 */
  .qup-img-uploader{
    position: relative;
    display: inline-block;
  }
  .qup-img-uploader .uploader-border{
    border: 1px dashed rgb(217, 217, 217);
    font-size: 24px;
    color: #8c939d;
  }
  .qup-img-uploader .uploader-border:hover{
    border-color:#409EFF;
  }
  .qup-img-uploader .el-upload-list__item-actions:hover {
    opacity: 1;
  }
  .qup-img-uploader .el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, .5);
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
  }
  .qup-img-uploader .el-upload-list__item-actions span {
    display: none;
    cursor: pointer;
  }
  .qup-img-uploader .el-upload-list__item-actions:hover span {
    display: inline-block;
  }
  .qup-img-uploader .el-upload-list__item-actions span + span {
    margin-left: 15px;
  }

  /* 覆盖原样式 */
  .qup-img-uploader .el-progress {
    top: unset;
    left: unset;
    -webkit-transform: unset;
    transition: unset;
    bottom: unset;
    width: unset;
  }
  /** 单图片上传组件样式END */
</style>
