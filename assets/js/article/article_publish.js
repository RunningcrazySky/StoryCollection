$(function(){
    let layedit = layui.layedit;
    let layer = layui.layer;
    let form = layui.form

    // 定义加载文章分类的方法
    initCate()
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates/',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('加载文章分类失败！')
                }
                let str = ''
                $.each(res.data, function(i, item){
                    str += `
                    <option value=${item.Id}>${item.name}</option>
                    `
                })
                $('#formCate').append(str)
                form.render()
            }
        })
    }

    // 富文本编辑器
    layui.use('layedit', function(){
        layedit.build('demo'); //建立编辑器
      });
    //   图片裁剪效果
    let $image = $('#image')
    let options = {
        aspectRatio:400 / 280,
        preview:'.img-preview'
    }
    $image.cropper(options)

    // 点击选择封面按钮 ，绑定 input：file事件
    $('#chooseImg').on('click', function(){
        $('#coverFile').click()
    })

    // 监听 coverFile 的change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e){
        let file = e.target.files

        if(file.length === 0){
            return
        }
        let newImgURL = URL.createObjectURL(file[0])
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    let art_state = '已发布'
    // 点击草稿按钮修改文章发布状态
    $('#art-save').on('click', function(){
        art_state = '草稿'
    })

    // 为表单绑定 submit 事件
    $('#form-pub').on('submit', function(e){
        e.preventDefault();
        // 基于 from 表单，创建一个 formData 对象
        let fd = new FormData($(this)[0])  
        fd.append('state', art_state)
        
        // 封面裁剪后的图片输出为文件
        $image
        // 创建一个 Canvas 画布
        .cropper('getCroppedCanvas', { 
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作

            // 将文件对象储存到 fd 中
            fd.append('cover_img', blob)
            // 发起 ajax 请求
            publishArticle(fd)
        })
    })

    // 发表文章的函数
    function publishArticle(fd){
        $.ajax({
            method:'Post',
            url:'/my/article/add',
            data:fd,
            // 如果向服务器提交 FromData 格式的数据，必须添加两个配置项
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('发表文章失败！')
                }
                layer.msg(res.message)
                // 发布文章成功后跳转到文章列表
                location.href = '/article/article_list.html'
            }
        })
    }

})