$(function () {
  let layer = layui.layer;
  // 获取裁剪区域的 DOM 元素
  let $image = $("#image");
  // 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };
  // 创建裁剪区域
  $image.cropper(options);
  // 点击 上传 按钮事件
  $("#btnChooseImage").on("click", function () {
    $("#file").click();
  });
  // 为文件选择框添加 change 事件
  $("#file").on("change", function (e) {
    let fileList = e.target.files;
    if (fileList.length === 0) {
      return layer.msg("请选择图片！");
    }

<<<<<<< HEAD
    // 拿到用户选择图片
    let file = e.target.files[0];
    // 将文件转换为路径
    let imgURL = URL.createObjectURL(file);
    // 重新初始化裁剪区域
    //销毁旧的裁剪区域
    //重新设置图片路径
    // 重新舒适化裁剪区域
    $image.cropper("destroy").attr("src", imgURL).cropper(options);
  });
  // 修改头像
  $("#btnUpdate").on("click", function () {
    // 拿到用户裁剪后的头像
    let dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建canvas画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png");
    // 调用接口，把头像上传服务器
    $.ajax({
      method: "POST",
      url: "/my/update/avatar",
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新头像失败！");
        }
        layer.msg(res.message);
        window.parent.getUserInfo();
      },
    });
  });
});
=======
    //     // 拿到用户选择图片
        let file = e.target.files[0]
        // 将文件转换为路径
        let imgURL = URL.createObjectURL(file)
        // 重新初始化裁剪区域
        //销毁旧的裁剪区域
        //重新设置图片路径
        // 重新舒适化裁剪区域
        $image.cropper('destroy').attr('src', imgURL).cropper(options) 
    })
    $('#btnUpload').on('click', function(){
        let dataURL = $image
        .cropper('getCroppedCanvas', {
            width:100,
            height:100
        })
        .toDataURL('image/png')
        $.ajax({
            method:'POST',
            url:'/my/update/avatar',
            data:{
                avatar:dataURL
            },
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更换头像失败！')
                }
                layer.msg(res.message)
                window.parent.getUserInfo()
            }
        })
    })
})
>>>>>>> article
