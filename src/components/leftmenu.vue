/**
* 左边菜单
*/ 
<template>
  <el-menu default-active="2" :collapse="collapsed" collapse-transition router :default-active="$route.path" unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b">
    <div class="logobox">
      <img class="logoimg" src="../assets/书籍.png" alt="">
    </div>
    <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.menuname">
      <template slot="title">
        <i class="iconfont" :class="menu.icon"></i>
        <span>{{menu.menuname}}</span>
        <span style="display: none;">{{current}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item prop="erji" v-for="chmenu in menu.menus" :index="'/'+chmenu.url" :key="chmenu.menuid" :disabled="handletype()" >
          <i class="iconfont" :class="chmenu.icon"></i>
          <span>{{chmenu.menuname}}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
//import { menu } from '../api/userMG'
import Cookies from 'js-cookie'
this.type=Cookies.get("UserType");
//console.log(this.type)
export default {
  name: 'leftmenu',
  data() {
    return {
      collapsed: false,
      allmenu: []
    }
  },
  computed: {
        current:function(){
          var type=Cookies.get("UserType")
          console.log(type)
          if(type=='stu'){
            this.allmenu[1].menus=null
          }
          //return Cookies.get("userType")
      }
    },
  // 创建完毕状态(里面是操作)
  created() {
    // 获取图形验证码
    let res = {
      success: true,
      data: [
        {
          menuid: 1,
          icon: 'icon-sousuoxiangqing',
          menuname: '基础查询',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 2,
              icon: 'icon-noun__cc',
              menuname: '参考书籍查询',
              hasThird: 'N',
              url: 'booksearch/search',
              menus: null
            }
          ]
        },
        {
          menuid: 33,
          icon: 'icon-guanli',
          menuname: '课程管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 34,
              icon: 'icon-jiaoshihuaxiang',
              menuname: '参考书籍管理',
              hasThird: 'N',
              url: 'bookmanage/manage',
              menus: null,
              
            }
          ]
        },
      ],
      msg: 'success'
    }
          this.allmenu = res.data
    
    // menu(localStorage.getItem('logintoken'))
    //   .then(res => {
    //     console.log(JSON.stringify(res))
    //     if (res.success) {
    //       this.allmenu = res.data
    //     } else {
    //       this.$message.error(res.msg)
    //       return false
    //     }
    //   })
    //   .catch(err => {
    //     this.$message.error('菜单加载失败，请稍后再试！')
    //   })
    // 监听
    /* this.$root.Bus.$on('toggle', value => {
      this.collapsed = !value
    }) */
  },
  methods:{
    handletype(){
      //console.log(this.type)
      //return Cookies.get("userType")
      /* console.log(this.allmenu[1].menus)
      this.allmenu[1].menus=null */
      //this.disabled=true
    }

  },
  

}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}
.el-menu-item-group__title {
  padding: 0px;
}
.el-menu-bg {
  background-color: #1f2d3d !important;
}
.el-menu {
  border: none;
}
.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}
.logoimg {
  height: 40px;
}
</style>