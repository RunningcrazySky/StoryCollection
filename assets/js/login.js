$(function () {
  // 登录/注册链接跳转
  $("#link_login").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });
  $("#link_reg").on("click", function () {
    $(".reg-box").hide();
    $(".login-box").show();
  });
  // 添加自定义校验规则
  var form = layui.form;
  console.log(form);
  var layer = layui.layer;
  form.verify({
    password: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    repassword: function (value) {
      let password = $(".reg-box [name=password]").val();
      if (password !== value) {
        return "两次密码不一致！";
      }
    },
  });
  // 监听注册表单事件
  $("#form_reg").on("submit", function (e) {
    e.preventDefault();
    let data = {
      username: $("#form_reg [name=username]").val(),
      password: $("#form_reg [name=password]").val(),
    };
    // $.ajax({
    //     url:'/api/reguser',
    //     method:'POST',
    //     data,
    //     success:function(res){
    //         if(res.status !== 0){
    //             return console.log('注册失败')
    //         }
    //         console.log('注册成功！');
    //     }
    // })
    $.post("/api/reguser", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg("注册成功！");
      $("#link_reg").click();
    });
  });
  // 监听登录表单事件
  $('#form_login').on('submit', function(e){
      e.preventDefault()
      $.post('/api/login',
    //   快速获取表单数据
      $(this).serialize(),
      function(res){
        console.log(res);
        if(res.status !== 0){
            return layer.msg('登录失败！');
        }
        layer.msg(res.message)
        // 登录成功获得的 token 字符串保存到本地
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = '/index.html'
      })
  })
});
