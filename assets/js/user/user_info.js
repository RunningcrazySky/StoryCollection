$(function(){
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname:function(value){
            if(value.length > 6){
                return '昵称长度必须为 1 ~ 6 个字符！'
            }
        }
    })

    initUserInfo()
    // 初始化用户信息
    function initUserInfo(){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取用户基本信息失败！')
                }
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 重置用户信息
    $('#btnReset').on('click', function(e){
        e.preventDefault();
        initUserInfo()
    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function(e){
        e.preventDefault()
        // 发起 ajax 数据请求
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！')
                // 调用父页面方法，修改用户头像和文本
                window.parent.getUserInfo()
            }
        })
    })
    
})