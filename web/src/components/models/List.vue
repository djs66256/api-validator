<template>
  <Table :columns='columns' :data='dataSource' @edit='edit'/>
</template>

<script>
import 'whatwg-fetch'

export default {
  name: 'model-list',
  data() {
    let self = this
    return {
      columns: [
        {
          title: '名称',
          key: 'interface'
        },
        {
          title: '操作',
          key: 'action',
          width: 180,
          render: function(createElement, params) {
            let interfaceInfo = params.row
            return createElement('div', [
              createElement('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: function() {
                    self.detail(interfaceInfo)
                  }
                }
              }, '查看'),
              createElement('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: function() {
                    self.edit(interfaceInfo)
                  }
                }
              }, '编辑'),
              createElement('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: function() {
                    self.delete(interfaceInfo)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      dataSource: [
        {
          interface: 'hahahah'
        }
      ]
    }
  },
  methods: {
    detail(interfaceInfo) {

    },
    delete(interfaceInfo) {

    },
    edit(interfaceInfo) {
      this.$router.push({
        name: 'modelEdit', 
        params: {
          interface: interfaceInfo.interface
        }
        })
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

