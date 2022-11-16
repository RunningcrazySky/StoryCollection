$(function(){
    getUserInfo()

    let layer = layui.layer
    // 点击按钮实现退出功能
    $('#btnLogout').on('click', function(){
        // 询问是否退出
        layer.confirm('请确认是否退出？', {icon: 3, title:'提示'}, function(index){
            // 清空本地 token
            localStorage.removeItem('token')
            // 跳转到登录页面
            location.href = '/login.html'
            // 关闭 confirm 询问框
            layer.close(index);
          });
        
    })
})

// 获取用户基本信息
function getUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // headers 请求头配置对象
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success:function(res){
            if(res.status !== 0){
                return layui.layer.msg('用户信息请求失败！')
            }
            // 调用用户信息渲染函数
            renderAvatar(res.data)
        },
        // 无论成功与否都调用 complete 函数
        // complete:function(res){
        //     // console.log('执行了 complete 回调');
        //     // console.log(res);
        //     // 如果获取用户信息失败，强制清除停止跳转
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         localStorage.removeItem('token')
        //         location.href= '/login.html'
        //     }
        // }
    })
}

// 渲染用户头像和名称
function renderAvatar(user){
    // 获取用户名称
    let name = user.nickname || user.username
    // 渲染名字
    $('.welcome').html(`欢迎  ${name}`)
    // 按需渲染用户头像
    if(user.user_pic !== null){
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}
