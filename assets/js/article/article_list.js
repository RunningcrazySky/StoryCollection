$(function () {
  layer = layui.layer;
  form = layui.form;
  laypage = layui.laypage;
  // 定义一个查询参数，将来请求数据时将参数对象提交到服务器
  let dataPage = {
    pagenum: 1, // 默认显示第一页
    pagesize: 2, // 默认每页显示两条数据
    cate_id: "", // 文章分类id 默认为空
    state: "", // 文章状态默认为空
  };

  // 获取文章列表数据
  initTable();
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: dataPage,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败！");
        }
        // 遍历拼接字符串
        let str = "";
        $.each(res.data, function (i, item) {
          // item.pub_date = timeFormat(item.pub_date)
          item.pub_date = item.pub_date.substr(0, 19)
          str += `
                <tr>
                    <td>${item.title}</td>
                    <td>${item.cate_name}</td>
                    <td>${item.pub_date}</td>
                    <td>${item.state}</td>
                    <td>
                        <button type="button" class="layui-btn layui-btn layui-btn-sm layui-btn layui-btn-danger btnEdit" data-id="${item.Id}">编辑</button>
                        <button type="button" class="layui-btn layui-btn layui-btn-sm btnDel" data-id="${item.Id}">删除</button>
                    </td>
                </tr>
                    `;
        });
        // 渲染到页面
        $("tbody").html(str);
        // 渲染分页
        renderPage(res.total);
      },
    });
  }

  //  初始化文章分类的方法
  initCate();
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章分类失败");
        }
        // 拼接字符串
        let str = "";
        $.each(res.data, function (i, item) {
          str += `
                <option value=${item.Id}>${item.name}</option>
                `;
        });
        // 渲染到页面容器
        $("#selectCate").append(str);
        // 通过 layui render 重新渲染表单区域的 ui 结构
        form.render();
      },
    });
  }

  //  监听 form-search 表单的 submit 事件
  $("#form-search").on("submit", function (e) {
    // submit 事件需要阻止默认提交行为
    e.preventDefault();
    // 获取表单选中项的值，为查询参数 dataPage 对应属性赋值
    dataPage.cate_id = $("[name=cate_id]").val();
    dataPage.state = $("[name=state]").val();
    // 根据最新筛选条件，重新渲染表格数据
    initTable();
  });

  //  定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: "pageBox",
      count: total,
      limit: dataPage.pagesize,
      curr: dataPage.pagenum,
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数
        //首次不执行，避免回调地狱且通过点击页码触发
        if (!first) {
          dataPage.pagenum = obj.curr;
          dataPage.pagesize = obj.limit;
          initTable();
        }
      },
    });
  }

  // 通过代理，为删除按钮绑定点击事件处理函数
  $("tbody").on("click", ".btnDel", function () {
    // 获取页面删除按钮个数
    let len = $(".btnDel").length;
    // 获取文章 id
    let id = $(this).attr("data-id");
    // 询问用户是否删除数据
    layer.confirm("确认删除？", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除失败！");
          }
          layer.msg("删除成功！");
          if (len === 1) {
            dataPage.pagenum =
              dataPage.pagenum === 1 ? 1 : dataPage.pagenum - 1;
          }
          initTable();
        },
      });

      layer.close(index);
    });
  });

  // 通过代理，为编辑按钮绑定点击事件处理函数
  let indexAdd = null;
  $("tbody").on("click", ".btnEdit", function () {
    // 添加弹出框
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "编辑文章信息",
      content: `
    <form class="layui-form" id="form-edit" lay-filter="form-edit">
      <input type="hidden" name="Id">
      <div class="layui-form-item">
        <label class="layui-form-label">文章标题</label>
        <div class="layui-input-block">
          <input type="text" name="title" required  lay-verify="required" placeholder="请输入文章标题" autocomplete="off" class="layui-input">
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">文章状态</label>
        <div class="layui-input-block">
          <input type="text" name="state" required  lay-verify="required" placeholder="请输入文章状态" autocomplete="off" class="layui-input">
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-input-block">
          <button class="layui-btn" lay-submit lay-filter="formDemo" id="form-btnEdit">确认修改</button>
        </div>
      </div>
    </form>
        `,
    });
    let id = $(this).attr("data-id");
    // 发起请求获取文章列表数据
    $.ajax({
      method: "GET",
      url: "/my/article/" + id,
      success: function (res) {
        form.val("form-edit", res.data);
      },
    });
  });

  // 通过代理，为修改内容的表单绑定 submit 事件
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    // 基于 form-edit 创建一个 FormData 对象
    let fd = new FormData($(this)[0]);
    console.log($(this)[0]);
    // 发起 ajax 请求
    editArticle(fd);
  });

  // 修改文章的函数
  function editArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/edit",
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg("修改文章失败！");
        }
        layer.msg("修改文章成功！");
        layer.close(indexAdd);
        initTable();
      },
    });
  }
});
