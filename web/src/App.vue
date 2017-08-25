<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        height: 100%;
    }
    .layout-content-row {
      height: 100%;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
</style>
<template>
    <div class="layout">
        <Row type="flex" class="layout-content-row" >
            <i-col span="5" class="layout-menu-left">
                <Menu ref="menu" active-name="validator" theme="dark" width="auto" 
                  :open-names="['api']" @on-select="selectItem">
                    <div class="layout-logo-left"></div>
                    <Submenu name="api">
                        <template slot="title">
                            <Icon type="ios-navigate"></Icon>
                            验证
                        </template>
                        <Menu-item name="validator">
                          <!-- <router-link :to="{name: validator}"> -->
                          校验
                          <!-- </router-link> -->
                          </Menu-item>
                        <Menu-item name="api">接口</Menu-item>
                        <Menu-item name="models">模型</Menu-item>
                    </Submenu>
                    <Submenu name="manager">
                        <template slot="title">
                            <Icon type="ios-keypad"></Icon>
                            管理
                        </template>
                        <!-- <Menu-item name="2-1">选项 1</Menu-item>
                        <Menu-item name="2-2">选项 2</Menu-item> -->
                    </Submenu>
                </Menu>
            </i-col>
            <i-col span="19">
              <router-view></router-view>
                <!-- <div class="layout-header"></div>
                <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb-item href="#">首页</Breadcrumb-item>
                        <Breadcrumb-item href="#">应用中心</Breadcrumb-item>
                        <Breadcrumb-item>某应用</Breadcrumb-item>
                    </Breadcrumb>
                </div>
                <div class="layout-content">
                    <div class="layout-content-main">内容区域</div>
                </div>
                <div class="layout-copy">
                    2011-2016 &copy; TalkingData
                </div> -->
            </i-col>
        </Row>
    </div>
</template>
<script>
    export default {
      name: 'App',
      methods: {
        selectItem: function (name) {
          console.log(name, this.$route, this.$router)
          if (name !== this.$route.name) {
            this.$router.replace({name})
          }
        }
      }
    }
</script>
