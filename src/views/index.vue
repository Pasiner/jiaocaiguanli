<template>
  
    <el-container class="index-con">
        <el-aside :class="showclass">
          <leftmenu></leftmenu>
        </el-aside>
        <el-container class="main-con"> 
          <el-header class="index-header" style="height: 100px;font-size: 3vw;color: aliceblue;font-family: '微软雅黑' ;">教材信息共享与管理平台
           <!--  <div id="AlertDiv"></div> -->
              <!-- <H1>教材信息共享与管理平台</H1> -->
          <el-menu class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff" active-text-color="#fff">
            <el-submenu index="2" class="submenu" border-bottom-color="#334157" >
              <!-- <template slot="title">{{user.userRealName}}</template> -->
              <template slot="title">
                <img src="../assets/头像.png" style="width:40px;height:40px;"/>
                您好，{{current}}</template>
              <!-- <el-menu-item index="2-1">设置</el-menu-item> -->
              <!-- <el-menu-item @click="content()" index="2-2">个人中心</el-menu-item> -->
              <el-menu-item class="child" @click="exit()" index="2-1">退出登录</el-menu-item>
            </el-submenu>
          </el-menu>
          </el-header>
          <el-main clss="index-main">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    
</template>

<script>
  import leftmenu from '../components/leftmenu.vue'
  import Cookies from 'js-cookie'
  this.user=Cookies.get("userName");
  console.log(Cookies.get("userName"))

  export default {
      name:'index',
      data() {
          return {
              showclass: 'asideshow',
              showtype: false,
          };
      },

      methods: {
        // 退出登录
        exit() {
          

          this.$confirm('退出登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              setTimeout(() => {
                /* this.$store.commit('logout', 'false') */
               
                //this.$store.commit('logout', 'false')
                
                //window.localStorage.clear();
                /* let backlen=history.length-1;
                history.go(-backlen); */

                
                this.$router.replace({ path: '/' })
                window.localStorage.clear();
                window.sessionStorage.clear();
                history.pushState(null, null, document.URL);

                window.addEventListener("popstate",function(e) {  

                    history.pushState(null, null, document.URL);

                }, false);

                this.$message({
                  type: 'success',
                  message: '已退出登录!'
                })
              }, 1000)
              // loginout()
              //   .then(res => {
              //     if (res.success) {
              //       //如果请求成功就让他2秒跳转路由
              //       setTimeout(() => {
              //         this.$store.commit('logout', 'false')
              //         this.$router.push({ path: '/login' })
              //         this.$message({
              //           type: 'success',
              //           message: '已退出登录!'
              //         })
              //       }, 1000)
              //     } else {
              //       this.$message.error(res.msg)
              //       this.logining = false
              //       return false
              //     }
              //   })
              //   .catch(err => {
              //     // 获取图形验证码
              //     this.getcode()
              //     this.logining = false
              //     this.$message.error('退出失败，请稍后再试！')
              //   })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        },
        
        goback() {
            //this.$router.go(-1);
           // history.pushState(null,null,document.URL)
           },
      
      },
          // 注册组件
      components: {
        leftmenu
      },
      computed: {
        current(){
        return Cookies.get("UserName")
        
      }
      },
    /*   created() {
        // 监听
        this.$root.Bus.$on('toggle', value => {
          if (value) {
            this.showclass = 'asideshow'
          } else {
            setTimeout(() => {
              this.showclass = 'aside'
            }, 300)
          }
        })
      }, */
          };
          
</script>

<style scoped>
     .el-menu.el-menu--horizontal{
      border-bottom: 0px;
      
    }
    .el-menu.el-menu--horizontal {
      border-bottom: 0px;
    }
    .el-menu--horizontal>.el-submenu.is-active .el-submenu__title{
      border-bottom: 0px;
    }
    .el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
      border-color: #334157;
    }
    .index-con {
      height: 100%;
      width: 100%;
      box-sizing: border-box;
    }
    
    .aside {
      width: 64px !important;
      height: 100%;
      background-color: #334157;
      margin: 0px;
    }
    .asideshow {
      width: 240px !important;
      height: 100%;
      background-color: #334157;
      margin: 0px;
    }
    .index-header{
      padding-top: 18px;
      border-left: 2px solid #333;
      
      background-color: #334157;
    }
    .index-main {
      padding: 0px;
      border-left: 2px solid #333;
    }
    #AlertDiv{
      height: 100px;
      /* text-align: center; */
      /* display: table; */
      /* position: relative; */
    }
    /* #AlertDiv H1{
      position: relative;
      vertical-align:middle;
      display: table-cell;
      color: aliceblue;
      font-size: 30vw;
      width: 100%;
      left: 330px;

      
    
    } */
    /* .buttonimg {
      height: 60px;
      top:35px;
      display: table;
      position: absolute;
      background-color: transparent;
      border: none;
    }
    .showimg {
      width: 26px;
      height: 26px;
      position: absolute;
      top: 17px;
      left: 10px;
    }
    .showimg:active {
      border: none;
    } */
    .submenu {
      position: absolute;
      right: -10px;
      top:-55px;
      float:right;
    }
    </style>
    