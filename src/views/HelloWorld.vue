
<template>
  <div class="login-demo">
    <div class="login-line">
    </div>
    <div class="login-name">欢迎使用遥感信息工程学院教材信息共享与管理系统</div>
    <div class="login-name1">© 2021 All Rights Reserved. WHURS</div>
    <div class="login-wrap">
      <el-row type="flex" justify="center" mode="vertical">
        <!-- 登录框 -->
        <el-form ref="loginForm" :rules="formRules" :model="user" status-icon label-width="70px" label-position="left" mode="vertical">
          <el-tabs :stretch="true" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="登录" name="login">
              <br>
              <el-form-item prop="type" label="身份">
                <el-select v-model="user.type" placeholder="请选择身份"  >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="username" label="用户名">
                <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item prop="password" label="密码">
                <el-input v-model="user.password" show-password placeholder="请输入密码" @keyup.enter.native="doLogin('loginForm')" >
                  <template slot="prepend"></template>
                </el-input>
              </el-form-item>
              <el-checkbox id="savePassword" ref="rem"  v-model="user.checked"  @keyup.enter.native="doLogin('loginForm')" >记住密码</el-checkbox>
              <router-link to="/forgetPassword">忘记密码</router-link>
              <br>
              <br>
              <el-form-item>
                <el-button type="primary" @click="doLogin('loginForm')">登 录</el-button>
              </el-form-item>
              
            </el-tab-pane>
            <!-- 注册框 -->
            <el-tab-pane label="注册" name="register">
              <el-form-item prop="type" label="身份">
                <el-select v-model="user.type" placeholder="请选择身份"  >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="username" label="用户名">
                <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item prop="email" label="邮箱">
                <el-input v-model="user.email" placeholder="请输入邮箱,用于找回密码"></el-input>
              </el-form-item>
              <el-form-item prop="password" label="设置密码">
                <el-input v-model="user.password" show-password placeholder="请输入密码"></el-input>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" icon @click="doRegister('loginForm')">注册账号</el-button>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-row>
    </div>
  </div>
  
</template>
<script>
import axios from "axios";
import Cookies from 'js-cookie';
export default {
  name: "login",
  data() {
    return {
      url:process.env.VUE_APP_URL,
      options: [{
          value: 'stu',
          label: '学生'
        }, {
          value: 'tea',
          label: '教师'
        }],
      activeName: "login",
      checked: false,
      user: {
        username: "",
        email:"",
        password: "",
        type:""
      },
      
      // 通过 formRules 属性传入约定的验证规则
      formRules: {
        username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { type: "string", min: 6, message: "密码不能小于6位", trigger: "blur" }
        ],
        type:[{ required: true, message: "用户名不能为空", trigger: "blur" }],
        // bug--由于此处登录和注册共用一个el-form，因此只能绑定一个rules,如果邮箱设置为必填，将导致无法登陆。一般情况下，将登录和注册分别放在不同的el-form中，为它们设置不同的rules
        email: [
          /* { required: true, message: "请输入邮箱地址", trigger: "blur"  }, */
          { type: "email", message: "找回密码时使用", trigger: ["blur", "change"] }
        ]
      }
    }
  },
  created() {
      var vm = this;
      // 在页面加载时从cookie获取登录信息
      let userName = vm.getCookie("userName");
      let userPwd = vm.getCookie("userPwd");
      let userType = vm.getCookie("userType");
      console.log(userName)

      // 如果存在赋值给表单，并且将记住密码勾选
      if (userName) {
        vm.user.username = userName;
        vm.user.password= userPwd;
        vm.user.type = userType;
       // vm.user.checked = true;
      }
    },
    

  methods: {
    // 登录
    doLogin(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let name=this.user.username;
          console.log(name)
          axios.post('api/user/selectUser',{
            name
          }).then(res=>{
            let data = res.data[0];
            console.log(data)
            this.userName = data.name;
            this.password = data.password;
            this.type = data.type;
            console.log(this.user.type)

            Cookies.set("UserName",this.userName);
            Cookies.set("UserType",this.type);

            this.setUserInfo()

            /* console.log(this.$refs.rem.checked)
            //记住密码
            if (this.$refs.rem.checked==true) {
              console.log(1)
              var username = this.user.username;
              var password = this.user.password;
              window.sessionStorage.username = username;
              window.sessionStorage.password = password;
              console.log(window.sessionStorage.username)
              localStorage.rmbPassword = true;
            } else {
              localStorage.rmbPassword = false;
            } */
            
            if(this.password==this.user.password && this.type==this.user.type){
              this.$router.replace({ path: '/booksearch/search' })
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              //alert("登陆成功！")
            }else{
              //alert("登陆失败，请重新输入账号密码")
              this.$message({
                message: '登录失败，请重新输入账号密码',
                type:'error'})
            }
          }).catch(err=>{
            console.log(err)
          })
        } else {
          return false;
        }
      });
    },
    // 注册账号
    doRegister(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          console.log(valid);
          axios.post('api/user/selectUser_like',{
                      name: this.user.username,
                      email: this.user.email,
                 }).then(res=>{
                   let data = res.data[0];
                   //let email=this.email
                   console.log(data)
                   console.log(res.data)
                   //this.email = data.email;
                   //this.password = data.password;
                  // this.type = data.type;
                  // console.log(this.user.type)
                  //console.log(this.email)
                   if(res.data.length==0){
                    //console.log(email)
                       
                    axios.post('api/user/addUser',{
                      name: this.user.username,
                      email: this.user.email,
                      password: this.user.password,
                      type:this.user.type
                    }).then(res=>{
                      this.activeName="login";
                      this.$message({
                       message: '注册成功',
                       type: 'success'})
                       
                    }
                    ).catch(err=>{
                         console.log(err)
                       })
                     /* this.$message({
                       message: '登录成功',
                       type: 'success'
                     }) */
                     //alert("登陆成功！")
                   }else{
                     //alert("登陆失败，请重新输入账号密码")
                     this.$message({
                       message: '该用户名或邮箱已被注册，请重新注册',
                       type:'error'})
                       
                   }
                 }).catch(err=>{
                   console.log(err)
                 })
          /* axios
            .post("/api/user/addUser", {
              name: this.user.username,
              email: this.user.email,
              password: this.user.password,
              type:this.user.type
            })
            .then(res => {
              if(res.status==200){
                alert('注册成功');
                this.activeName="login";
              }
              else{
              }
              // console.log("输出response.data", res.data);
            
            }).catch(err=>{
              console.log(err)
            }) */
        } else {
          return false;
        }
      });
    },

    setUserInfo() {
        var vm = this;
        // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
        // 如果没有勾选，储存的信息为空
        if (vm.user.checked) {

          vm.setCookie("userName", vm.user.username);
          vm.setCookie("userPwd", vm.user.password);
          vm.setCookie("userType", vm.user.type);
          vm.setCookie("checked", vm.user.checked);
        } else {
          vm.setCookie("userName", "");
          vm.setCookie("userPwd", "");
          vm.setCookie("userType","");
        }
    },

    // 获取cookie
    getCookie: function(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + '=')
        if (start !== -1) {
          start = start + key.length + 1
          var end = document.cookie.indexOf(';', start)
          if (end === -1) end = document.cookie.length
          return unescape(document.cookie.substring(start, end))
        }
      }
      return ''
    },
    // 保存cookie
    setCookie(cName, value, expiredays) {
      var exdate = new Date()
      exdate.setDate(exdate.getDate() + expiredays)
      document.cookie = cName + '=' + decodeURIComponent(value) +
        ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
    },








    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 记住密码
   /*  savePassword() {
      if (this.$ref.rem.checked=="checked") {
        var username = this.user.username;
        var password = this.user.password;
        window.sessionStorage.username = username;
        window.sessionStorage.password = password;
        console.log(window.sessionStorage.username)
        localStorage.rmbPassword = true;
      } else {
        localStorage.rmbPassword = false;
      }
    } */
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 公共样式 */
/* li {
  list-style: none;
  float: left;
} */
 
.login-demo {
  position: fixed;
  width: 100%;
  height: 100%;
  background: url("../assets/yinghua.jpg") no-repeat;
  background-size: cover;
  top: 0px;
  left: 0px;
  overflow: hidden;
}
 
.login-wrap {
  background: url("../assets/login_bg.png") no-repeat;
  width: 340px;
  height: 360px;
  margin: 230px auto;
  margin-left: 60px;
  border-radius: 6px;
  line-height: 20px;
  padding-top: 0px;
}

.login-line {
  width: 960px;
  height: 1px;
  position: absolute;
  top:160px;
  left: 50px;
  border-top: solid #919fb1 1px;

}

.login-name {
  width: 970px;
  height: 100px;
  position: absolute;
  font-size: 40px;
  color: #bdc2ca;
  font-style: normal;
  font-weight: bolder;
  font-family: "微软雅黑";
  top:96px;
  left: 30px;
}
.login-name1 {
  width: 270px;
  height: 100px;
  position: absolute;
  font-size: 12px;
  color: #bdc2ca;
  font-style: normal;
  font-weight: bolder;
  font-family: 'Times New Roman', Times, serif;
  top:164px;
  left: 20px;
}
 
.el-tabs>>>.el-tabs__item {
  font-size: 18px;
  margin: 5px auto;
}
 
.el-tabs__nav {
  font-size: 18px;
}
 
a {
  text-decoration: none;
  color: #606266;
  font-size: 14px;
  float: right;
}
 
a:hover {
  color: coral;
}
 
.el-checkbox {
  text-indent: 4px;
}
 
.login-wrap>>>.el-form-item__label {
  padding: 0px 4px 0 0;
}
 
.login-wrap>>>.el-checkbox__label {
  padding-left: 0px;
}
 
.el-button {
  width: 118%;
  margin-left: -40px;
  background-color:
    #16696a;
  letter-spacing: 5px;
  border: 0px;
}
.el-select{
  /* width: 100px; */
}
 
</style>