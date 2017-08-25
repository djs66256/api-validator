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
export default {
  name: 'api-list',
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
          key: 'api'
        },
        {
          title: 'model',
          key: 'model'
        },
        {
          title: '操作',
          key: 'action',
          width: 180,
          render: function(createElement, params) {
            let apiInfo = params.row
            return createElement('div', [
              createElement('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: function() {
                    self.edit(apiInfo)
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
                    self.delete(apiInfo)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      dataSource: [

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
    delete(apiInfo) {
      let ok = () => {
        return fetch(`/api/api/${apiInfo.api}`, {
          method: 'DELETE'
        })
        .then(res => {
          return res.json()
        })
        .then(res => {
          if (res.code === 1) {
            this.$Message.info({content: '删除成功！'})
            this.dataSource = this.dataSource.filter(i => i.api !== apiInfo.api)
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
        title: `是否删除定义：${apiInfo.api}`,
        ok
      }
    },
    edit(apiInfo) {
      this.$router.push({
        name: 'apiEdit', 
        params: {
          api: apiInfo.api
        }
      })
    }
  },
  mounted() {
    fetch('/api/apis')
    .then(res => res.json())
    .then(res => {
      if (res.code === 1) {
        let apis = res.result
        console.info(apis)
        this.dataSource = apis
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
