<template>
  <div>
    <div class="navigation">
      <Button type="success" @click="addModel">新建Model</Button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'model',
  methods: {
    addModel: function() {
      this.$router.push({name: 'modelAdd'})
    }
  }
}
</script>

<style scoped>
  .navigation {
    padding: 10px 20px;
    height: 60px;
    line-height: 60px;
    font-size: 18;
    display: flex;
    flex-direction: row;
  }
</style>

