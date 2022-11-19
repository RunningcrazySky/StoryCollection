$(function () {
  let layer = layui.layer;
  let form = layui.form;
  // 获取文章分类列表
  getArticleType();
  function getArticleType() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章分类列表失败！");
        }
        //   拼接字符串
        let str = "";
        // 对数据遍历，拼接到页面显示
        $.each(res.data, function (i, item) {
          str += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.alias}</td>
                    <td>
                        <button type="button" class="layui-btn layui-btn-sm btn-edit" data-id=${item.Id}>编辑</button>
                        <button type="button" class="layui-btn layui-btn-danger layui-btn-sm btn-delete" data-id=${item.Id}>删除</button>
                    </td>
                </tr>
            `;
        });
        // 放入页面的容器显示
        $(".layui-table tbody").html(str);
      },
    });
  }

  //   添加类型按钮的弹出框
  let indexAdd = null;
  $("#addType").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: `
      <form class="layui-form" id="form-add">
      <div class="layui-form-item">
        <label class="layui-form-label">文章标题</label>
        <div class="layui-input-block">
          <input type="text" name="name" required  lay-verify="required" placeholder="请输入文章标题" autocomplete="off" class="layui-input">
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">分类别名</label>
        <div class="layui-input-block">
          <input type="text" name="alias" required  lay-verify="required" placeholder="请输入分类别名" autocomplete="off" class="layui-input">
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-input-block">
          <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
          <button type="reset" class="layui-btn layui-btn-primary">重置</button>
        </div>
      </div>
    </form>
          `,
    });
  });

  // 通过代理为 form-add 表单绑定 submit 事件
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("新增文章分类失败！");
        }
        getArticleType();
        layer.msg("新增文章分类成功！");
        layer.close(indexAdd);
      },
    });
  });

  // 通过代理为 btn-edit 绑定 click 事件
  let indexEdit = null
  $('body').on('click', '.btn-edit', function(e){
    // 弹出一个修改文章信息的框
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: `
      <form class="layui-form" id="form-edit" lay-filter="form-edit">
      <!-- 隐藏域 -->
      <input type="hidden" name="Id">
      <div class="layui-form-item">
        <label class="layui-form-label">分类名称</label>
        <div class="layui-input-block">
          <input type="text" name="name" required  lay-verify="required" placeholder="请输入分类名称" autocomplete="off" class="layui-input">
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">分类别名</label>
        <div class="layui-input-block">
          <input type="text" name="alias" required  lay-verify="required" placeholder="请输入分类别名" autocomplete="off" class="layui-input">
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-input-block">
          <button class="layui-btn" lay-submit lay-filter="formDemo">确认修改</button>
        </div>
      </div>
    </form>
          `,
    })
    
    let id = $(this).attr('data-id')
    // 发起请求获取文章分类数据
    $.ajax({
      method:'GET',
      url:'/my/article/cates/' + id,
      success:function(res){
        form.val('form-edit', res.data)
      }
    })

    // 通过代理形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e){
      e.preventDefault()
      $.ajax({
        method:'POST',
        url:'/my/article/updatecate',
        data:$(this).serialize(),
        success:function(res){
          if(res.status !== 0){
            return layer.msg("更新分类信息失败！")
          }
          layer.msg(res.message)
          layer.close(indexEdit)
          getArticleType()
        }
      })
    })
  })

  // 通过代理为 btn-delete 绑定 click 事件
  $('body').on('click', '.btn-delete', function(){
    let id = $(this).attr('data-id')
    layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        method:'GET',
        url:'/my/article/deletecate/' + id,
        success:function(res){
          if(res.status !== 0){
            return layer.msg(res.message)
          }
          layer.msg(res.message)
          layer.close(index)
          getArticleType()
        }
      })
      
    });
  })
});
