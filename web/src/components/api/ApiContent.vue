<template>
  <div>
    <div class="navigation">
      <Button type="success" @click="addApi">新建Api</Button>
    </div>
    <router-view></router-view>
  </div>  
</template>

<script>
import 'whatwg-fetch'
export default {
  name: 'api',
  methods: {
    addApi() {
      this.$router.push({
        name: 'apiAdd'
      })
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
