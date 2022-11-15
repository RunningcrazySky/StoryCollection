// 每次调用 $.get/post/ajax 之前先调用 ajaxPrefilter 函数
$.ajaxPrefilter(function (options) {
  // options.url = 'http://www.liulongbin.top:3007' + options.url
  options.url = "http://api-breakingnews-web.itheima.net" + options.url;
  // options.url = 'http://ajax.frontend.itheima.net' + options.url
  //   console.log(options.url);
});
