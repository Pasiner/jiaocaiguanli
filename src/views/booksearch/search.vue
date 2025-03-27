<template>
    <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>教材信息查询</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="formInline" class="user-search" @submit.native.prevent>
        <el-form-item label="课程名称：">
          <el-input size="small" v-model="formInline.deptName" placeholder="输入课程名称" @keyup.enter.native="selectBook()"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="selectBook">搜索</el-button>
          <!-- <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button> -->
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table :key="keyvalue" size="small" :data="this.listData.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
        <el-table-column align="center" type="selection" width="60">
        </el-table-column>
        <el-table-column align="center" sortable prop="id" label="序号" width="80">
        </el-table-column>
        <el-table-column align="center" sortable prop="name" label="课程名称" width="230">
        </el-table-column>
        <el-table-column align="center" sortable prop="master" label="课程组组长" width="195">
        </el-table-column>
        <el-table-column align="center" sortable prop="book" label="参考书籍" width="290">
        </el-table-column>
  
        <el-table-column align="center" label="详细信息" width="260">
          <template slot-scope="scope">
            <el-button size="mini" @click="lookjianjie(scope.$index, scope.row)">信息查看</el-button>
            <el-button size="mini" @click="lookpic(scope.$index, scope.row)">图片预览</el-button>
          </template>
        </el-table-column>
       <!--  <el-table-column sortable prop="editTime" label="修改时间" width="300">
          <template slot-scope="scope">
            <div>{{scope.row.editTime|timestampToTime}}</div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column sortable prop="editUser" label="修改人" width="300">
        </el-table-column> -->
        <!-- <el-table-column align="center" label="操作" min-width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>

         <!-- 简介与目录界面 -->
  
      <el-dialog :title="title" :visible.sync="editFormVisible1" width="40%" @click="closeDialog" v-dialogDrag>
        <!-- <el-input type="textarea" v-model=""></el-input> -->
        <el-form  label-width="40px" :model="editForm" :rules="rules" ref="editForm" >
          <el-form-item label="简介" prop="jianjie">
            <el-input type="textarea"  v-model="editForm.jianjie" :rows="6"  readonly="readonly" placeholder="书籍简介"  ></el-input>
          </el-form-item>
          <el-form-item label="目录" prop="mulu">
            <el-input type="textarea"  v-model="editForm.mulu" :rows="10"  readonly="readonly" placeholder="书籍目录"  ></el-input>
          </el-form-item>
          <!-- <el-form-item label="课程名称" prop="name1">
            <el-input size="small" v-model="editForm.deptName" auto-complete="off" placeholder="请输入课程名称"></el-input>
          </el-form-item>
          <el-form-item label="课程组组长" prop="master1">
            <el-input size="small" v-model="editForm.deptmaster" auto-complete="off" placeholder="请输入课程组组长"></el-input>
          </el-form-item>
          <el-form-item label="参考教材" prop="book1">
            <el-input size="small" v-model="editForm.deptbook" auto-complete="off" placeholder="请输入参考教材"></el-input> -->
          </el-form-item>
        </el-form>
      </el-dialog>

        <!-- 封面图界面 -->
      <el-dialog :title="title"  :visible.sync="editFormVisible2" width="35%" v-dialogDrag @click="closeDialog" style="padding-left: 0px;" @closed="destroyimg">
        <el-form class="bookface" label-width="40px" :model="editForm" :rules="rules" ref="editForm" >
          <!-- <el-form-item label="简介" prop="jianjie">
            <el-input type="textarea"  v-model="editForm.jianjie" :rows="6"  readonly="readonly" placeholder="书籍简介"  ></el-input>
          </el-form-item> -->
            <img :src="image" crossorigin="anonymous" style="width: 400px;;height: 400px;"/>
          
        </el-form>
      </el-dialog>



      <!-- 分页组件 -->
      <el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="currentPage"
						:page-sizes="[5, 10, 20, 40]"
						:page-size="pagesize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="listData.length">
				</el-pagination>
      <!-- <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination> -->
      <!-- 编辑界面 -->
      <!-- <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
        <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
          <el-form-item label="部门名称" prop="name">
            <el-input size="small" v-model="editForm.deptName" auto-complete="off" placeholder="请输入部门名称"></el-input>
          </el-form-item>
          <el-form-item label="部门代码" prop="deptNo">
            <el-input size="small" v-model="editForm.deptNo" auto-complete="off" placeholder="请输入部门代码"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog">取消</el-button>
          <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
        </div>
      </el-dialog> -->
    </div>
  </template>

  <script>
    import axios from 'axios'
   // import { deptList, deptSave, deptDelete } from '../../api/userMG'
   // import Pagination from '../../components/changenum'
    export default {
      data() {
        return {
          nshow: true, //switch开启
          fshow: false, //switch关闭2
          loading: false, //是显示加载
          editFormVisible: false, //控制编辑页面显示与隐藏
          editFormVisible1: false, //控制编辑页面显示与隐藏
          editFormVisible2: false, //控制编辑页面显示与隐藏
          image:"",
          keyvalue: 0,
          title: '添加',
          editForm: {
            deptId: '',
            deptName: '',
            deptNo: '',
            token: localStorage.getItem('logintoken'),
            currentPage:1, 
            pagesize:5    //	每页的数据
          },
          // rules表单验证
          rules: {
            deptName: [
              { required: true, message: '请输入课程名称', trigger: 'blur' }
            ],
            deptNo: [{ required: true, message: '请输入部门代码', trigger: 'blur' }]
          },
          formInline: {
            page: 1,
            limit: 10,
            varLable: '',
            varName: '',
            token: localStorage.getItem('logintoken')
          },
          // 删除部门
          seletedata: {
            ids: '',
            token: localStorage.getItem('logintoken')
          },
          userparm: [], //搜索权限
          listData: [], //用户数据
          // 分页参数
         /*  pageparm: {
            currentPage: 1,
            pageSize: 10,
            total: 10
          } */
        }
      },
      // 注册组件
    /*   components: {
        Pagination
      }, */
      /**
       * 数据发生改变
       */
    
      /**
       * 创建完毕
       */
      created() {
        this.getdata(this.formInline)
      },
    
      /**
       * 里面的方法只有被调用才会执行
       */
      methods: {
       /*  handleclose(){
          this.editFormVisible2=false
          this.image="http://localhost:8888/index.png"
        }, */

        destroyimg(){
          this.image=""
        },

        // 初始页currentPage、初始每页数据数pagesize和数据data
	    	handleSizeChange: function (size) {
            this.pagesize = size;
	    			console.log(this.pagesize)
            this.keyvalue += 1
        },
        handleCurrentChange: function(currentPage){
          
          this.currentPage = currentPage;
	    		console.log(this.currentPage)
          console.log(this.key)
          console.log(this.listData.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize))
          this.keyvalue += 1

        },
        // 获取公司列表
        getdata(parameter) {
          this.loading = true
          // 模拟数据开始
          let res = {
            code: 0,
            msg: null,
            count: 0,
            data: [
            ]
          }
          this.loading = false
          this.listData = res.data
          this.currentPage = this.formInline.page
          this.pagesize = this.formInline.limit
          this.total = res.count
          console.log(this.listData.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize))
          // 模拟数据结束
    
          /***
           * 调用接口，注释上面模拟数据 取消下面注释
           */
          // deptList(parameter)
          //   .then(res => {
          //     this.loading = false
          //     if (res.success == false) {
          //       this.$message({
          //         type: 'info',
          //         message: res.msg
          //       })
          //     } else {
          //       this.listData = res.data
          //       // 分页赋值
          //       this.pageparm.currentPage = this.formInline.page
          //       this.pageparm.pageSize = this.formInline.limit
          //       this.pageparm.total = res.count
          //     }
          //   })
          //   .catch(err => {
          //     this.loading = false
          //     this.$message.error('菜单加载失败，请稍后再试！')
          //   })
        },
        // 分页插件事件
       /*  callFather(parm) {
          this.formInline.page = parm.currentPage

          this.formInline.limit = parm.pageSize
          this.getdata(this.formInline)
          console.log(this.formInline.limit)

        }, */

        //查看简介
        lookjianjie: function(index, row) {

          this.editFormVisible1 = true
          this.title="详细信息"
          console.log(row.introduction)
          this.editForm.jianjie=row.introduction
          this.editForm.mulu=row.content
          },
          
          //查看图片
          lookpic: function(index, row) {
          console.log(this.image)
          this.editFormVisible2 = true
          this.title="书籍封面图"
          if(row.picture!=null){
              this.image='http://10.133.170.5:8888/'+row.picture+'.png'
          }
          if(row.picture==''||row.picture==null){
            this.image='http://10.133.170.5:8888/index_1.png'
          }
          /*     var obj = document.getElementById("bookface");
          console.log(obj.src) */
          /* obj.src=row.picture;
          console.log(obj.src) */
          //console.log(row.picture)
          
        },

        // 搜索事件
        selectBook(){
          console.log(document.documentElement.clientWidth)
          let name = this.formInline.deptName;
          axios.post('api/book/selectBook',{
            name
          }).then(res=>{
            console.log(res.data)
            let data = res.data[0];
            this.bookName = data.name;
            this.cankao = data.book
            //alert(this.cankao)
            this.listData = res.data
            console.log(res.data.slice(0,10))
            res.count=Object.keys(res.data).length
            // 分页赋值
           /*  this.pageparm.currentPage = this.formInline.page
            this.pageparm.pageSize = this.formInline.limit
            this.pageparm.total = res.count
            console.log(this.formInline.page) */
            //this.listData = res.data.slice(0,this.pageparm.pageSize)
          }).catch(err=>{

          })
          console.log(this.cankao)
          

        },
        // 关闭编辑、增加弹出框
        closeDialog() {
          console.log(this.image)
          this.image=""
          this.editFormVisible=false
          
        }

        
        
      
      },
    }
    </script>
    
    <style scoped>
    .user-search {
      margin-top: 20px;
    }
    .userRole {
      width: 100%;
    }
    </style>