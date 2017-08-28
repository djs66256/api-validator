<template>
  <div>
    <div class="navigation">
      <Button type="primary" :loading="validating" icon="checkmark-round" @click="validate">
          <span v-if="!validating">验证数据</span>
          <span v-else>验证中...</span>
      </Button>
      <div class="selector-content">
        <span>Model定义</span>
        <Select v-model="selectedModel" class="layout-selector" @on-change="selectedApiChanged">
          <Option v-for="item in apis" :value="item.model" :key="item.api">{{ item.api }}</Option>
        </Select>
      </div>
    </div>
    <div class="content-container">
      <Alert v-if="validateError" type="error">{{ validateError }}</Alert>
      <Row class="input-margin">
        <Col span="14">
          <Input size="large" placeholder="输入校验数据" type="textarea" :rows="30" v-model="data"/>
        </Col>
        <Col span="10">
          <Input class="model-content" size="large" type="textarea" :rows="30" readonly
            v-if="modelData && modelData.data && modelData.data.length" v-model="modelData.data"/>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import 'whatwg-fetch'
export default {
  name: 'validate-content',
  data() {
    return {
      validating: false,
      data: '',
      apis: [],
      selectedModel: null,
      modelData: '',
      validateError: null
    }
  },
  created() {
    fetch('/api/apis')
    .then(res => res.json())
    .then(res => {
      if (res.code === 1) {
        let apis = res.result
        console.info(apis)
        this.apis = apis
      }
      else {
        throw new Error(res.message)
      }
    })
    .catch(err => {
      console.error(err)
      this.$Message.error({content: err.message || '未知错误'});
    })
  },
  methods: {
    validate() {
      fetch(`/api/validate`, {
        method: 'POST',
        body: {
          data: this.data,
          model: this.selectedModel
        }
      }).then(res => res.json())
      .then(res => {
        if (res.code === 1) {
          this.$Message.success({content: '验证通过'})
          this.validateError = null
        }
        else {
          throw new Error(res.message)
        }
      })
      .catch(e => {
        console.error(e)
        this.validateError = e.message
      })
    },
    selectedApiChanged() {
      fetch(`/api/model/${this.selectedModel}`)
      .then(res => {
        return res.json()
      })
      .then(res => {
        if (res.code === 1) {
          this.modelData = res.result
        }
        else {
          throw new Error(res.message)
        }
      })
      .catch(e => {
        console.error(e)
        this.$Message.error({content: e.message})
      })
    }
  }
}
</script>

<style scoped>
.navigation {
  padding: 10px 20px;
  height: 60px;
  line-height: 40px;
  font-size: 18;
  display: flex;
  flex-direction: row;
}
.selector-content {
  display: flex;
  line-height: 40px;
  margin-left: 20px;
  font-size: 16px
}
.layout-selector {
  width: 300px;
  margin-top: 6px;
  margin-left: 10px;
}
.content-container {
  display: flex;
  padding: 20px;
  flex-direction: column;
}
.input-margin {
  margin-top: 20px
}
.model-content {
  padding-left: 20px;
  padding-right: 20px;
}
</style>

