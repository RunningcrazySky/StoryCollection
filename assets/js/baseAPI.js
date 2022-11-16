// 每次调用 $.get/post/ajax 之前先调用 ajaxPrefilter 函数

// 本函数可以拿到给 ajax 提供的配置对象
$.ajaxPrefilter(function (options) {
  // 发起真正的 ajax 请求之前，统一拼接请求根路径
  options.url = "http://api-breakingnews-web.itheima.net" + options.url;

  // 为有权限的接口，统一设置请求头
  if(options.url.indexOf('/my/') !== -1){
    options.headers = {
      Authorization:localStorage.getItem('token') || ''
    }
  }

  // 统一设置complete函数
  options.complete = function(res){
    // console.log('执行了 complete 回调');
    // console.log(res);
    // 如果获取用户信息失败，强制清除停止跳转
    if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
      localStorage.removeItem('token')
      location.href= '/login.html'
    }
  }
});
