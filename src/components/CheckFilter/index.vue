<template>
  <div class="checkFilter">
    <span>{{ title }}：</span>
    <el-checkbox v-show="!single" v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选
    </el-checkbox>
    <el-checkbox
      v-for="item in filterData"
      :key="item.value"
      v-model="checkedStatus"
      :label="item.value"
      @change="handleChangeStatus"
    >{{ item.label }}</el-checkbox>
  </div>
</template>

<script>
export default {
  name: 'CheckFilter',
  props: {
    filterData: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: '-'
    },
    property: {
      type: String,
      default: ''
    },
    defualtChoice: {
      type: Array,
      default: () => {
        return []
      }
    },
    single: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkAll: false,
      checkedStatus: [],
      statusFilter: [{
        id: this.property,
        property: this.property,
        operator: 'in',
        value: '[0]'
      }],
      isIndeterminate: true,
      lastSingleCheck: this.defualtChoice[0] // 存上一个单选选项值
    }
  },
  created() {
    this.checkedStatus = this.defualtChoice
    this.formatToFilter()
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedStatus = val ? this.filterData.map(item => {
        return item.value
      }) : []
      this.isIndeterminate = false

      this.formatToFilter()
    },
    formatToFilter() {
      if (this.single) {
        this.checkedStatus.length > 0 ? this.statusFilter = this.checkedStatus[0] : this.statusFilter = ''
      } else {
        this.checkedStatus.length > 0 ? this.statusFilter = [{
          id: this.property,
          property: this.property,
          operator: 'in',
          value: `[${this.checkedStatus}]`
        }] : this.statusFilter = []
      }

      this.$emit('changeFilter', this.statusFilter)
    },
    handleChangeStatus(value) {
      if (this.single) {
        if (this.checkedStatus.length < 1) {
          this.checkedStatus = [this.lastSingleCheck]
        }
        this.checkedStatus = JSON.parse(JSON.stringify([this.checkedStatus[this.checkedStatus.length - 1]]))
        this.lastSingleCheck = this.checkedStatus[0]
      }
      const checkedCount = this.checkedStatus.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.filterData.length
      this.checkAll = checkedCount === this.filterData.length

      this.formatToFilter()
    }
  }
}

</script>
<style lang="scss" scoped>
  .checkFilter {
    padding: 5px 0;
    padding-left: 70px;
    position: relative;
    min-height: 29px;
    .el-checkbox{
      margin-bottom: 5px;
    }
  }
  .checkFilter>span{
    position: absolute;
    left: 0;
    top: 5px;
    line-height: 19px;
  }

</style>
