<template>
  <div>
    <div class="navigation">
      <Button type="success" @click="addApi">新建Api</Button>
    </div>
    <ApiList />
    <!-- <router-view></router-view> -->
  </div>  
</template>

<script>
import 'whatwg-fetch'
import ApiList from '@/components/api/List'

export default {
  name: 'api',
  methods: {
    addApi() {
      this.$router.push({
        name: 'apiAdd'
      })
    }
  },
  components: {
    ApiList
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
