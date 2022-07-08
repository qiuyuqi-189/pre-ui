<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container" style="margin: 10px 0 10px 0;">
      <el-input
        v-model="query.username"
        clearable
        class="filter-item"
        style="width: 200px;"
        size="small"
        placeholder="请输入名称"
        @keyup.enter.native="handleFind"
      />
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFind">查询
      </el-button>
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
    </div>

    <!--打印表格-->
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">

      <el-table-column type="selection" />
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="名称" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>

      <el-table-column label="年龄" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>

      <el-table-column label="入学时间" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.time) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="地区" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
        </template>
      </el-table-column>

      <el-table-column label="简介" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.introduce }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    新增修改界面-->
    <el-dialog
      :title="!dataForm.testid ? '新增' : '修改'"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-width="80px"
        :size="size"
        :rules="dataRule"
        style="text-align:left;"
        @keyup.enter.native="submitForm()"
      >
        <el-form-item label="姓名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="dataForm.username" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="sex" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="dataForm.sex" label="男">男</el-radio>
            <el-radio v-model="dataForm.sex" label="女">女</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="年龄" prop="age" :label-width="formLabelWidth">
          <template>
            <el-input-number v-model="dataForm.age" controls-position="right" :min="0" :max="200" @change="handleChange" />
          </template>
        </el-form-item>
        <el-form-item label="入学时间" prop="time" :label-width="formLabelWidth">
          <el-date-picker
            v-model="dataForm.time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择时间"
          />
        </el-form-item>

        <el-form-item label="地区" prop="area" :label-width="formLabelWidth">
          <el-select v-model="dataForm.area" placeholder="请选择状态">
            <el-option label="江西" value="江西" />
            <el-option label="北京" value="北京" />
            <el-option label="河北" value="河北" />
            <el-option label="河南" value="河南" />
            <el-option label="山东" value="山东" />
            <el-option label="浙江" value="浙江" />
            <el-option label="湖北" value="湖南" />
            <el-option label="北京" value="北京" />
          </el-select>
        </el-form-item>

        <el-form-item label="简介" prop="status" :label-width="formLabelWidth">
          <el-input
            v-model="dataForm.introduce"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">取消</el-button>
        <el-button :size="size" type="primary" :loading="editLoading" @click="submitEditForm">确定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import { deleteTest, updateTest, addTest, viewList } from '@/api/test'
import { parseTime } from '@/utils/index'

export default {
  data() {
    return {
      size: 'small',
      tableData: [],
      age: 20,
      title: '',
      dialogFormVisible: false, // 控制弹出框
      formLabelWidth: '120px',
      isEditForm: false,
      currentPage: 1,
      pageSize: 10,
      total: 0, // 总数量
      // 分类菜单列表
      // deptData: [],
      // tree配置项
      // deptTreeProps: {
      //   label: 'username',
      //   children: 'children'
      // },
      query: {
        username: ''
      },
      dataForm: {
        username: '',
        sex: '',
        age: '',
        time: '',
        area: '',
        introduce: ''
      },
      dataRule: {
        username: [{ required: true, message: '小明不能为空', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
        time: [{ required: true, message: '时间不能为空', trigger: 'blur' }],
        area: [{ required: true, message: '地区不能为空', trigger: 'blur' }]
      },
      // option: [{
      //   value: 'zhinan',
      //   label: '指南'
      //
      // }],
      loading: false,
      dialogVisible: false,
      editLoading: false

    }
  },
  created() {
    this.getTestList()
  },
  methods: {
    handleChange(value) {
      console.log(value)
    },
    parseTime,
    getTestList: function() {
      this.loading = true
      const params = new URLSearchParams()
      params.append('username', this.query.username)
      viewList(params).then(res => {
        this.tableData = res.data.data
        this.loading = false
      })
    },
    handleFind: function(row) {
      this.getTestList()
    },
    handleReset: function() {
      this.query = {
        username: ''
      }
      this.fetchList()
    },
    // // 换页
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.getTestList()
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true
      this.dataForm = {}
    },
    // 编辑界面
    handleEdit: function(row) {
      this.isEditForm = true
      this.dialogVisible = true
      this.dataForm = row
    },

    handleDelete: function(row) {
      const that = this
      this.$confirm('此操作将删除租户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTest(row.testid).then(response => {
            if (response.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              that.getTestList()
            } else {
              this.$message({
                type: 'error',
                message: response.data.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    submitEditForm: function() {
      if (this.isEditForm) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              updateTest(this.dataForm).then((res) => {
                if (res.data.code === 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({ message: res.data.msg, type: 'error' })
                }
                this.editLoading = false
                this.$refs['dataForm'].resetFields()
                this.dialogVisible = false
                this.getTestList()
              })
            })
          }
        })
      } else {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              console.log(this.dataForm)
              addTest(this.dataForm).then((res) => {
                this.editLoading = true
                if (res.data.code === 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({ message: res.data.msg, type: 'error' })
                }
                this.editLoading = false
                this.$refs['dataForm'].resetFields()
                this.dialogVisible = false
                this.getTestList()
              })
            })
          }
        })
      }
    }
  }
}
</script>
