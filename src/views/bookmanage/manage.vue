<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教材信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search" @submit.native.prevent>
      <el-form-item label="课程名称：">
        <el-input size="small" v-model="formInline.deptName" placeholder="输入课程名称" @keyup.enter.native="selectBook()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="selectBook">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :key="keyvalue" size="small" :data="this.listData.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column align="center" sortable prop="id" label="序号" width="70">
      </el-table-column>
      <el-table-column align="center" sortable prop="name" label="课程名称" width="220">
      </el-table-column>
      <el-table-column align="center" sortable prop="master" label="课程组组长" width="110">
      </el-table-column>
      <el-table-column align="center" sortable prop="book" label="参考书籍" width="280">
      </el-table-column>

      <el-table-column align="center" label="详细信息" width="250">
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
      
      <el-table-column align="center" label="操作" min-width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 增加界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" v-dialogDrag @click="closeDialog" style="padding-bottom: 10px;" class="dialogclass">
      <el-form label-width="90px" :model="editForm" :rules="rules" ref="editForm" :inline="true" style="margin-left: 2%;" label-position="left">
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程序号"  prop="id1">
              <el-input size="small" v-model="editForm.deptid" auto-complete="off"  readonly="readonly" placeholder="默认记录序号" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程名称" prop="name1">
              <el-input size="small" v-model="editForm.deptName" auto-complete="off" placeholder="请输入课程名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程组长" prop="master1">
              <el-input size="small" v-model="editForm.deptmaster" auto-complete="off" placeholder="请输入课程组组长"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参考教材" prop="book1">
              <el-input size="small" v-model="editForm.deptbook" auto-complete="off" placeholder="请输入参考教材"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="书籍简介" prop="jianjie1">
              <el-input type="textarea"  v-model="editForm.jianjie1" :rows="4" auto-complete="off"  placeholder="书籍简介"  ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="书籍目录" prop="mulu1">
              <el-input type="textarea"  v-model="editForm.mulu1" :rows="4" auto-complete="off"  placeholder="书籍目录"  ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="  上传封面图"  prop="fengmian" style="width: 480px;left: -90px;position: relative;">
          
<!--         </el-form-item>
         </el-col>
         <el-col :span="12">
          <el-form-item label="上传图片"> -->
          <el-upload
            class="avatar-uploader"
            action="/api/upload/upImg"
            :show-file-list="false"
            list-type="picture-card"

            :http-request="upload"
	        :before-upload='ImgBeforeAvatarUpload'
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 140px;height: 140px;" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        </el-col>
        </el-row>
       <!--  <el-form-item label="序号" prop="id1">
          <el-input size="small" v-model="editForm.deptid" auto-complete="off"  readonly="readonly" placeholder="默认记录序号" ></el-input>
        </el-form-item>
        <el-form-item label="课程名称" prop="name1">
          <el-input size="small" v-model="editForm.deptName" auto-complete="off" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="课程组组长" prop="master1">
          <el-input size="small" v-model="editForm.deptmaster" auto-complete="off" placeholder="请输入课程组组长"></el-input>
        </el-form-item>
        <el-form-item label="参考教材" prop="book1">
          <el-input size="small" v-model="editForm.deptbook" auto-complete="off" placeholder="请输入参考教材"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="jianjie1">
          <el-input size="small" v-model="editForm.jianjie1" auto-complete="off" placeholder="请输入参考教材"></el-input>
        </el-form-item>
        <el-form-item label="目录" prop="mulu1">
          <el-input size="small" v-model="editForm.mulu1" auto-complete="off" placeholder="请输入参考教材"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 简介与目录界面 -->

    <el-dialog :title="title" :visible.sync="editFormVisible1" width="40%" @click="closeDialog" @closed="destroyimg" v-dialogDrag>
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
    <el-dialog :title="title" :visible.sync="editFormVisible2" width="35%" @click="closeDialog" style="padding-left: 0px;" v-dialogDrag @closed="destroyimg">
      <el-form class="bookface" label-width="40px" :model="editForm" :rules="rules" ref="editForm" >
        <!-- <el-form-item label="简介" prop="jianjie">
          <el-input type="textarea"  v-model="editForm.jianjie" :rows="6"  readonly="readonly" placeholder="书籍简介"  ></el-input>
        </el-form-item> -->
          <img :src="image" crossorigin="anonymous" style="width: 400px;;height: 400px;"/>
        
      </el-form>
    </el-dialog>




     <!-- 编辑界面 -->
    <!--  <el-dialog :title="title" :visible.sync="editFormVisible1" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="课程名称" prop="name">
          <el-input size="small" v-model="editForm.deptName" auto-complete="off" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="课程组组长" prop="master">
          <el-input size="small" v-model="editForm.deptmaster" auto-complete="off" placeholder="请输入课程组组长"></el-input>
        </el-form-item>
        <el-form-item label="参考教材" prop="book">
          <el-input size="small" v-model="editForm.deptbook" auto-complete="off" placeholder="请输入参考教材"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">确定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
  import axios from 'axios'
  
 // import { deptList, deptSave, deptDelete } from '../../api/userMG'
  import Pagination from '../../components/changenum'
  export default {
    data() {
      return {
        nshow: true, //switch开启
        fshow: false, //switch关闭2
        fileList:[],
        loading: false, //是显示加载
        editFormVisible: false, //控制编辑页面显示与隐藏
        editFormVisible1: false, //控制编辑页面显示与隐藏
        editFormVisible2: false, //控制编辑页面显示与隐藏
        keyvalue: 0,
        title: '添加',
        imageUrl: "",
        image:"",
        editForm: {
          deptid:'',
          deptName: '',
          deptmaster: '',
          deptbook: '',
          jianjie1:'',
          mulu1:'',
          token: localStorage.getItem('logintoken'),
          currentPage:1, 
          pagesize:5    //	每页的数据
        },
        // rules表单验证
        rules: {
          deptName: [
            { required: true, message: '请输入课程名称', trigger: 'blur' }
          ]
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
      /*   // 分页参数
        pageparm: {
          currentPage: 1,
          pageSize: 10,
          total: 10
        } */
      }
    },
    /* // 注册组件
    components: {
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
      
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },

      destroyimg(){
          this.image=""
        },
      

      upload(f) {
        // console.log(f)
        // 1. 获取表单数据   fromData 表单数据
        let fromData = new FormData()
        fromData.append("file", f.file)
        // 2. 发起请求
        this.$axios({
          method: 'post',
          url: f.action,
          data: fromData
        }).then(res => {
          // 3. 请求成功之后  图片回显
          console.log(res)
          this.imageUrl = res.data.url 
        })
      },
      //上传前校验图片规则
      ImgBeforeAvatarUpload(file) {
        console.log(file)
        const isJPG = file.type === "image/jpeg" || file.type === "image/png";
　　  　const isLt2M = file.size / 1024 / 1024 < 8;
　　　  if (!isJPG) {
　　　　　this.$message.error("上传图片只能是 JPG 和 Png 格式!");
　　　　　return false;
　　  　}
　　  　if (!isLt2M) {
　　　　　this.$message.error("上传图片大小不能超过 2MB!");
　　　　　return false;
        }
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
   /*    // 分页插件事件
      callFather(parm) {
        this.formInline.page = parm.currentPage
        this.formInline.limit = parm.pageSize
        this.getdata(this.formInline)
      }, */
      // 搜索事件
      selectBook(){
        let name = this.formInline.deptName;
        axios.post('api/book/selectBook',{
          name
        }).then(res=>{
          //console.log(res.dat)
          let data = res.data[0];
          
          this.bookName = data.name;
          this.cankao = data.book
          //alert(this.cankao)
          this.listData = res.data

          console.log(Object.keys(res.data).length)
          res.count=Object.keys(res.data).length

          // 分页赋值
          this.currentPage = this.formInline.page
          this.pagesize = this.formInline.limit
          this.total = res.count
        }).catch(err=>{

        })

      },
      //修改事件
      handleEdit: function(index, row) {
          this.editFormVisible = true
          if (row != undefined && row != 'undefined') {
            this.title = '修改'
            this.fileList=[]
            if(row.picture!=null){
              this.imageUrl='http://10.133.170.5:8888/'+row.picture+'.png'
            }
            if(row.picture==null || row.picture==""){
              this.imageUrl='http://10.133.170.5:8888/index_1.png'
            }
            this.editForm.deptid=row.id
            this.editForm.deptName=row.name
            this.editForm.deptmaster = row.master
            this.editForm.deptbook = row.book
            this.editForm.jianjie1=row.introduction
            this.editForm.mulu1=row.content
          } else {
            this.title = '添加'
            this.editForm.deptid = ''
            this.editForm.deptName = ''
            this.editForm.deptmaster = ''
            this.editForm.deptbook = ''
            this.editForm.jianjie1=''
            this.editForm.mulu1=''       
            this.imageUrl=''

          }
        },
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
          console.log(row.picture)

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

        // 编辑、增加页面保存方法
      submitForm(editData) {
        if(this.title=='添加'){
          let name= this.editForm.deptName;
          let master = this.editForm.deptmaster;
          let book = this.editForm.deptbook;
          let introduction=this.editForm.jianjie1;
          let content=this.editForm.mulu1;
          var index1 = this.imageUrl.indexOf("/")
          var index11 = this.imageUrl.indexOf("/",index1+2)
          var index2 = this.imageUrl.indexOf(".")
          var picname=this.imageUrl.substring(index11+1,index2)
          console.log(index11)
          console.log(index2)
          console.log(picname)
          let picture=picname
          axios.post('/api/book/addBook',{
            name,master,book,introduction,content,picture
          }).then(res=>{
            alert('信息添加成功');
            this.editFormVisible=false;
          }).catch(err=>{
            console.log(err)
          })
        }else{
          let id = this.editForm.deptid;
          let name= this.editForm.deptName;
          let master = this.editForm.deptmaster;
          let book = this.editForm.deptbook;
          let introduction=this.editForm.jianjie1;
          let content=this.editForm.mulu1;
          var index1 = this.imageUrl.indexOf("/")
          var index11 = this.imageUrl.indexOf("/",index1+2)
          var index2 = this.imageUrl.indexOf(".")
          var picname=this.imageUrl.substring(index11+1,index2)
          console.log(index11)
          console.log(index2)
          console.log(picname)
          let picture=picname
          console.log(id)

          axios.post('/api/book/updateBook',{
            name,master,book,introduction,content,picture,id
          }).then(res=>{
            alert('信息修改成功');
            this.editFormVisible=false;
          }).catch(err=>{
            console.log(err)
          })
        }
        this.fileList=[]
          
         
       
      },
       // 删除公司
      deleteUser(index, row) 
      {
        this.$confirm('确定要删除吗?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res=>{
        //var data = this.$refs.multipleTable.selection;
        console.log(row.book)
        let name= row.name;
        let id = row.id
        //let master = row.master;
       // let book = row.book;
        axios.post('/api/book/deleteBook',{
          id/* ,book */
        }).then(res=>{
          alert('信息删除成功');
          this.listData.splice(index, 1);
        }).catch(err=>{
          console.log(err)
        })
       // location.reload();
        //console.log(this.editForm.deptName)
      })
      },
      // 关闭编辑、增加弹出框
      closeDialog() {
        this.editFormVisible=false
        this.fileList=[]
        this.imageUrl=''
        this.image=""
      }
      
    
    }
  }
  </script>
  
  <style scoped>
  .user-search {
    margin-top: 20px;
  }
  .userRole {
    width: 100%;
  }
 /*  .avatar-uploader .el-upload {
    border: 10px dashed #b34343;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  } */
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
 /*  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
 */



  </style>