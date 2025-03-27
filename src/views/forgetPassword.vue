
<template>
    <div class="login-demo1">
      <div class="login-wrap1">
        <el-row type="flex" justify="center" mode="vertical">
            <el-steps :active="active" finish-status="success" space="500px" align-center>
                <el-step title="验证用户名和邮箱"></el-step>
                <el-step title="输入验证码"></el-step>
                <el-step title="设置新密码"></el-step>
            </el-steps>
            <div  v-if="active === 0" class="common_div">
                <el-form :model="Form"  class="user-container" :rules="formRules" label-position="left" label-width="70px" size="medium">
                    <el-form-item prop="username" style="float: right; width: 60%" label="用户名">
                        <el-input type="text" v-model="Form.username" autofocus ref="username" auto-complete="off"
                                  placeholder="请输入要找回密码的用户名" prefix-icon="el-icon-user-solid" spellcheck="false" :disabled="isUsername">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="email" style="float: right; width: 60%" label="邮箱号">
                        <el-input type="text" v-model="Form.email" autofocus ref="email" auto-complete="off"
                                  placeholder="请输入用来找回密码的邮箱" prefix-icon="el-icon-message" spellcheck="false" :disabled="isUsername">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="active === 1" class="common_div1">
                <el-form :model="codeForm"  class="user-container"  :rules="formRules" label-position="left" label-width="70px" size="medium">
                    <el-form-item prop="code" style="float: right; width: 100%" label="验证码">
                        <el-input type="text" v-model="codeForm.code" autofocus ref="code" auto-complete="off"
                                  placeholder="请输入邮箱验证码" prefix-icon="el-icon-s-promotion" spellcheck="false">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="active === 2" class="common_div2">
                <el-form :model="ruleForm":rules="rules" ref="ruleForm" class="user-container"  label-position="left" label-width="80px" size="medium">
                  <el-form-item label="新密码" prop="newPwd">
                    <el-input v-model="ruleForm.newPwd" clearable size="small" type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="confirmPwd">
                    <el-input v-model="ruleForm.confirmPwd" clearable size="small" type="password"></el-input>
                  </el-form-item>
                 <!--  <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" class="button">确定</el-button>
                    <el-button class='' @click="resetForm('ruleForm')" class="button">重置</el-button>
                  </el-form-item> -->
                </el-form>
            </div>

            <br>
            <el-button id="forget" type="primary"  @click="next">下一步</el-button>

        
        </el-row>
      </div>
    </div>
    
  </template>
  <script>
  import axios from "axios";
  import $ from 'jquery'
  import Cookies from 'js-cookie';
  export default {
    name: "login",
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
                callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.confirmPwd !== '') {
              this.$refs.ruleForm.validateField('confirmPwd');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请再次输入密码'));
          } else if (value !== this.ruleForm.newPwd) {
              callback(new Error('两次输入密码不一致!'));
          } else {
              callback();
          }
      };

      return {
        
        active: 0,
        ruleForm: {
          newPwd: '',
          confirmPwd:''
        },
        Form: {
                username: '',
                email: '',
            },
            codeForm: {
                code: '',
            },
            disabled: false,
            isUsername: false,
            
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
            { required: true,type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }
          ],
          code:[{ required: true, message: "验证码不能为空", trigger: "blur" }],
        },
        rules: {
          newPwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur', required: true }
          ],
          confirmPwd:[
            { required: true, message: '请确认密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur', required: true }
          ],
        }
      }
    },
    created() {

      },
  
    methods: {
        next() {
          document.getElementById("forget").blur();
         // 当面板为0时，先判断用户名和邮箱是否输入，进行相关的验证
         if (this.active === 0) {
             if(this.Form.email==null || this.Form.username==null){
                 console.log(this.Form.username)
                 alert("请输入用户名及邮箱！")

             }
             else{
                 let name=this.Form.username;
                 let email=this.Form.email
                 //console.log(this.type)
                 axios.post('api/user/selectUser',{
                   name
                 }).then(res=>{
                   let data = res.data[0];
                   //let email=this.email
                   console.log(data)
                   this.email = data.email;
                   //this.password = data.password;
                  // this.type = data.type;
                  // console.log(this.user.type)
                  //console.log(this.email)
                   if(this.email==this.Form.email){
                    console.log(email)
                       
                    axios.post('api/email/eMail',{
                        email
                    }).then(res=>{
                      this.active++;

                    }
                    )
                     /* this.$message({
                       message: '登录成功',
                       type: 'success'
                     }) */
                     //alert("登陆成功！")
                   }else{
                     //alert("登陆失败，请重新输入账号密码")
                     this.$message({
                       message: '验证码发送失败，请重新输入用户名及邮箱',
                       type:'error'})
                   }
                 }).catch(err=>{
                   console.log(err)
                 })
                 
             }
                
            }
            if (this.active === 1) {
                // 如果验证码未输入，提示用户
                if (this.codeForm.code === '') {
                    this.$notify({
                        title: '警告',
                        message: '警告, 验证码未输入，请去您邮箱中查看!',
                        type: 'warning',
                        offset: 100,
                    });
                    //this.$refs.code.focus();
                }else {
                  console.log(this.Form.username)
                    this.$axios.post('api/user/selectCode', {
                      
                        name: this.Form.username,
                    }).then(res => {
                      console.log(res.data[0].code)
                      console.log(this.codeForm.code)
                        if (res.data[0].code == this.codeForm.code) {
                            //验证码输入正确，
                            console.log("success")
                            this.active++;
                            this.$notify({
                                title: '成功',
                                message: '验证码匹配正确！',
                                type: 'success',
                                duration: 0,
                                offset: 100,
                            });
                        }else if (res.data.code === 400) {
                            //验证码匹配错误返回对应信息
                            this.$message.error(res.data.message);
                        }
                    }).catch(failResponse => {

                    })
                }
              }
              // 当面板为2时，则到了用户输入密码的时候, 将密码传入后台
            if (this.active === 2) {
                //在发送密码之前，先校验一下是否输入了，不能让用户不小心输入了空密码
                if (this.ruleForm.newPwd === '') {
                    this.$notify({
                        title: '警告',
                        message: '警告, 新密码未输入',
                        type: 'warning',
                        offset: 100,
                    });
                    //this.$refs.password.focus();
                }else {
                  console.log(this.Form.username)
                    let password_new = this.ruleForm.confirmPwd;
                    this.$axios.post('api/user/updatePassword', {
                      password: password_new,
                      name: this.Form.username,
                    }).then(successResponse => {
                      console.log(successResponse.status )
                        if (successResponse.status === 200) {
                            //密码修改成功
                            this.$notify({
                                title: '成功',
                                message: '该账号密码修改正确！',
                                type: 'success',
                                duration: 0,
                                offset: 100,
                            });
                            this.$router.push({ path: '/' })
                        }else if (successResponse.data.code === 400) {
                            //修改密码失败，返回对应信息
                            this.$message.error(successResponse.data.message);
                        }
                    }).catch(failResponse => {

                    })
                }
            }


      }

    }
  }
  </script>
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style >
  /* 公共样式 */
  /* li {
    list-style: none;
    float: left;
  } */
  .el-steps{
      padding: 10px;
      width: 500px;
  }
   
  .login-demo1 {
    position: fixed;
    width: 100%;
    height: 100%;
    background: url("../assets/yinghua.jpg") no-repeat;
    background-size: cover;
    top: 0px;
    left: 0px;
    overflow: hidden;
  }
   
  .login-wrap1 {
    background: url("../assets/login_bg.png") no-repeat;
    position: relative;
    left: -70px;
    float: left;
    top:70px;
    width: 550px;
    height: 300px;
    margin: 175px auto;
    margin-left: 272px;
    border-radius: 6px;
    line-height: 20px;
    padding-top: 0px;
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
   
  #forget {
    position:absolute;
    width: 28%;
    top:240px;
    margin-left: 10px;
    background:
      #16696a;
    letter-spacing: 5px;
    color: aliceblue;
    border: 0px;
  }
  .forget--primary:focus, .forget--primary:hover{
      background-color:#16696a; ;
  }
  .common_div{
    position:absolute;
    left: -120px;
    top:100px;

  }
  .common_div1{
    position:absolute;
    left: 100px;
    top:120px;

  }
  .common_div2{
    position:absolute;
    left: 120px;
    top:100px;

  }
  .el-select{
    /* width: 100px; */
  }
   
  </style>