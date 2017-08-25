<template>
  <Table :columns='columns' :data='dataSource' />
</template>

<script>
import 'whatwg-fetch'

export default {
  name: 'model-list',
  data() {
    return {
      columns: [
        {
          title: '名称',
          key: 'interface'
        }
      ],
      dataSource: [
        {
          interface: 'hahahah'
        }
      ]
    }
  },
  created() {
    fetch('/api/models')
    .then(res => res.json())
    .then(res => {
      if (res.code === 1) {
        let models = res.result
        console.info(models)
        this.dataSource = Object.keys(models).sort((a, b) => a <= b).map(key => {
          return models[key]
        })
      }
      else {
        throw new Error(res.message)
      }
    })
    .catch(err => {
      console.error(err)
      this.$Message.error({content: err.message || '未知错误'});
    })
  }
}
</script>

<style scoped>

</style>

