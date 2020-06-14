<template>
  <div>
    <!-- 确保option有值后给avue赋值 v-if="option.column" -->
    <!-- sort-change排序方式改变 -->
    <avue-crud
      v-if="option.column"
      :page.sync="page"
      @on-load="changePage"
      @sort-change="changeSort"
      @search-change="search"
      :data="data.data"
      :option="option"
      @row-save="create"
      @row-update="update"
      @row-del="remove"
    >
      <template slot="menu" slot-scope="scope" v-if="resource=='posts'">
        <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="edit(scope)"></el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class ResourseList extends Vue {
  @Prop(String) resource!: string;
  data = {};
  //avue分页
  page: any = {
    total: 0,
    pageSize: 2,
    pageSizes: [2, 5, 10]
  };

  //查询条件
  query: any = {
    limit: 5,
    page: 1,
    sort: null,
    where: null,
    admin: true
  };

  //表格选项
  //设置编辑添加时数据是否可见editDisplay addDisplay
  option: any = {};

  created() {
    this.fetch();
    // alert(this.resource)

    //获取avue option
    this.fetchOption();
  }
  async fetchOption() {
    const res = await this.$http.get(`${this.resource}/option`);
    this.option = res.data;
  }
  async fetch() {
    //向get传递参数
    const res = await this.$http.get(`${this.resource}`, {
      params: {
        page: this.query.page,
        limit: this.query.limit,
        sort: this.query.sort,
        where: this.query.where,
        admin: this.query.admin
      }
    });
    // await使用return返回不是一个值，而是一个promise对象
    //res是promise对象,自带data属性，res.data是原始数据对象，包含 total和data两个属性
    this.data = res.data;
    this.page.total = res.data.total;
  }

  //页码改变激活的事件,
  //解构获取，获取对象两个属性{pageSize,currentPage}
  async changePage({ pageSize, currentPage }: any) {
    this.query.page = currentPage;
    this.query.limit = pageSize;
    this.fetch();
  }
  //改变排序方式
  async changeSort({ prop, order }: any) {
    if (!order) {
      this.query.sort = null;
    } else {
      //变量作为键必须加中括号{[key]:value}
      this.query.sort = order === "ascending" ? prop : "-" + prop;
    }
    this.fetch();
  }
  //监听搜索事件
  async search(where: any, done: any) {
    for (let k in where) {
      const field = this.option.column.find(v => v.prop === k);
      if (field.regex) {
        where[k] = { $regex: where[k] };
      }
    }
    this.query.where = where;
    this.fetch();
    done();
  }

  async create(row: any, done: any, loading: any) {
    await this.$http.post(`${this.resource}/create`, row);
    this.$message.success("创建成功");
    this.fetch();
    done();
  }
  async update(row: any, index: any, done: any, loading: any) {
    //   对象数组化，删除属性
    const data = JSON.parse(JSON.stringify(row));
    delete data.$index;
    const res = await this.$http.put(
      `${this.resource}/update/${row._id}`,
      data
    );
    if (res.data.success) {
      this.$message.success("修改成功");
    }else{
      this.$message.error("修改失败");
    }
    this.fetch();
    done();
  }
  async remove(row: any) {
    // 提醒用户是否删除
    try {
      await this.$confirm("你确定吗?");
    } catch (e) {
      return;
    }
    const res = await this.$http.delete(`${this.resource}/delete/${row._id}`);
    if (res.data.success) {
      this.$message.success("删除成功");
    } else {
      this.$message.warning("删除失败");
    }

    this.fetch();
  }

  //监听编辑事件
  edit({ row }) {
    // console.log(row._id);
    this.$router.push({ path: `/post/edit/${row._id}` });
  }
}
</script>

<style>
</style>