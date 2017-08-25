<template>
  <div>
    <div class="navigation">
      <Button type="primary" :loading="uploading" icon="checkmark-round" @click="addModel">
          <span v-if="!uploading">更新Model</span>
          <span v-else>更新中...</span>
      </Button>
    </div>
    <div class="add-container">
      <label>Model定义 
        <Input size="large" placeholder="输入英文名（禁用特殊符号）" v-model="name"/>
      </label>
      <Input class="input-margin" size="large" placeholder="输入接口定义" type="textarea" :rows="30" v-model="value"/>
    </div>
  </div>
</template>

<script>
import 'whatwg-fetch'

export default {
  name: 'add-model',
  data() {
    return {
      uploading: false,
      downloading: true,
      name: null,
      value: null
    }
  },
  methods: {
    addModel: function() {
      this.uploading = true
      fetch('/api/model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.name,
          interface: this.value
        })
      })
      .then(res => {
        return res.json()
      })
      .then(res => {
        if (res.code === 1) {
          this.$Message.success({content: '更新成功'})
          this.$router.back()
        }
        else {
          throw new Error(res.message)
        }
      })
      .catch(e => {
        console.log(e && e.message)
        this.$Message.error({content: e && e.message})
      })
      .then(() => {
        this.uploading = false
      })
    }
  },
  created() {
    if (this.$route.params && this.$route.params.interface) {
      this.$Loading.start();
      fetch(`/api/model/${this.$route.params.interface}`)
      .then(res => {
        return res.json()
      })
      .then(res => {
        if (res.code === 1) {
          console.log(res)
          let {name, data} = res.result
          this.name = name
          this.value = data
        }
        else {
          throw new Error(res.message)
        }
      })
      .catch(e => {
        console.error(e.message)
        this.$Message.error({content: e.message})
      })
      .then(() => {
        this.$Loading.finish();
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
.add-container {
  display: flex;
  padding: 20px;
  flex-direction: column;
}
.input-margin {
  margin-top: 20px
}
</style>

