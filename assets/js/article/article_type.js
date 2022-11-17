$(function () {
  layer = layui.layer;
  // 获取文章分类列表
  getArticleType();
  function getArticleType() {
    $("#addType").on("click", function () {
      $.ajax({
        method: "GET",
        url: "/my/article/cates",
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("获取文章分类列表失败！");
          }
          //   拼接字符串
          let str = ''
          // 对数据遍历，拼接到页面显示
          $.each(res.data, function (i, item) {
            str += `
                <tr>
                    <td>${item[i].name}</td>
                    <td>${item[i].alias}</td>
                    <td>
                        <button type="button" class="layui-btn layui-btn-sm">编辑</button>
                        <button type="button" class="layui-btn layui-btn-danger layui-btn-sm">删除</button>
                    </td>
                </tr>
            `;
          });
            // 放入页面的容器显示
            $(".layui-table tbody").html(str);
        },
      });
    });
  }
//   添加类型按钮的弹出框
  $("#addType").on("click", function () {
    layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: "添加文章分类",
      content: `
        <form class="layui-form" action="">
            <div class="layui-form-item">
                <label class="layui-form-label">分类名称</label>
                <div class="layui-input-block">
                <input type="text" name="title" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">分类别名</label>
                <div class="layui-input-block">
                <input type="text" name="alias" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-input-block">
                <button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button>
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
            `,
    });
  });
});
