$(function(){
    // 密码规则设置
    let form = layui.form
    let layer = layui.layer
    form.verify({
        password:[
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        samePwd:function(value){
            if(value === $('[name=oldPwd]').val()){
                return '新密码不能与旧密码一致！'
            }
        },
        rePwd:function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次密码不一致！'
            }
        }
    })

    // 重置密码
    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        $.post(
            '/my/updatepwd',
            $(this).serialize(),
            function(res){
                if(res.status !== 0){
                    return layer.msg('更新密码失败！')
                }
                layer.msg(res.message)
                // 重置表单：选取 jquery 对象并用 [0] 将其转换为DOM 对象，使用 reset 方法重置内容
                $('.layui-form')[0].reset()
            }
        )
    })
})