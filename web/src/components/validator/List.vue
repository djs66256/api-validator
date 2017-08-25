<template>
  <Table :columns='columns' :data='dataSource' />
</template>

<script>
export default {
  name: 'validator-list',
  data() {
    return {
      columns: [
        {
          title: '名称',
          key: 'interface'
        }
      ],
      dataSource: [

      ]
    }
  },
  mounted() {
    
  }
}
</script>

<style scoped>

</style>

