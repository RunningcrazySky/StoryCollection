$(function(){
    let layer = layui.layer
    // 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 配置选项
    const options = {
        // 纵横比
        aspectRatio:1,
        // 指定预览区域
        preview:'.img-preview'
    }
    // 创建裁剪区域
    $image.cropper(options)
    // 点击 上传 按钮事件 ???被动触发和主动触发都无效？？？
    $('#btnChooseImage').on('click', function(){
        return $('#file').click()
    })
    // 为文件选择框添加 change 事件 ???
    $('#file').on('change',function(e){
        let fileList = e.target.files
        if(fileList.length === 0){
            return layer.msg('请选择图片！')
        }

    //     // 拿到用户选择图片
    //     let file = e.target.files[0]
    //     // 将文件转换为路径
    //     let imgURL = URL.createObjectURL(file)
    //     // 重新初始化裁剪区域
    //     //销毁旧的裁剪区域
    //     //重新设置图片路径
    //     // 重新舒适化裁剪区域
    //     $image.cropper('destory').attr('src', imgURL).cropper(options) 
    })
})