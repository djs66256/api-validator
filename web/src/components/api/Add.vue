<template>
  <div>
    <div class="navigation">
      <Button type="primary" :loading="uploading" icon="checkmark-round" @click="addModel">
          <span v-if="!uploading">更新Api</span>
          <span v-else>更新中...</span>
      </Button>
    </div>
    <div class="add-container">
      <label>Model定义 
        <Input size="large" placeholder="输入Api" v-model="api"/>
      </label>
      <label class="input-margin">Model定义 
        <Input size="large" placeholder="输入Model" v-model="model"/>
      </label>
    </div>
  </div>
</template>

<script>
import 'whatwg-fetch'

export default {
  name: 'add-api',
  data() {
    return {
      uploading: false,
      downloading: true,
      api: null,
      model: null
    }
  },
  methods: {
    addModel: function() {
      this.uploading = true
      fetch('/api/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api: this.api,
          model: this.model
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
    if (this.$route.params && this.$route.params.api) {
      this.$Loading.start();
      fetch(`/api/api/${this.$route.params.api}`)
      .then(res => {
        return res.json()
      })
      .then(res => {
        if (res.code === 1) {
          console.log(res)
          let {api, model} = res.result
          this.api = api
          this.model = model
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

