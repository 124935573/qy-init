<template>
  <div id="app">
    <keep-alive :include="['PurchaseOrderList','PurchaseApplyList']">
      <router-view style="padding: 12px 12px 0" />
    </keep-alive>
    <!-- <router-view style="padding: 12px 12px 0" /> -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
