<template>
<div>
  <Table :columns='columns' :data='dataSource'/>
  <Modal
    v-model="modal.show"
    :title="modal.title"
    @on-ok="modalOk"
    @on-cancel="modalCancel">
    <p>{{modal.title}}</p>
  </Modal>
</div>
</template>

<script>
import 'whatwg-fetch'

export default {
  name: 'model-list',
  data() {
    let self = this
    return {
      modal: {
        show: false,
        loading: false,
        title: '',
        ok: null,
        cancel: null
      },
      columns: [
        {
          title: '名称',
          key: 'name'
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
    modalOk() {
      let modal = this.modal
      if (modal.ok) {
        this.modal = Object.assign(this.modal, {loading: true})
        modal.ok().catch(() => {}).then(() => {
          this.modal = {
            show: false,
            loading: false,
            title: ''
          }
        })
      }
      else {
        this.modalCancel()
      }
    },
    modalCancel() {
      this.modal = {
        show: false,
        loading: false,
        title: ''
      }
    },
    detail(interfaceInfo) {

    },
    delete(interfaceInfo) {
      let ok = () => {
        return fetch(`/api/model/${interfaceInfo.name}`, {
          method: 'DELETE'
        })
        .then(res => {
          return res.json()
        })
        .then(res => {
          if (res.code === 1) {
            this.$Message.info({content: '删除成功！'})
            this.dataSource = this.dataSource.filter(i => i.name !== interfaceInfo.name)
          }
          else {
            throw new Error(res.message)
          }
        })
        .catch(e => {
          console.log(e.message)
          this.$Message.error({content: e.message})
        })
      }
      this.modal = {
        show: true,
        loading: false,
        title: `是否删除定义：${interfaceInfo.name}`,
        ok
      }
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
        this.dataSource = models
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

