// pages/3dr2n2/3dr2n2.js\

import * as THREE from '../loaders/three.weapp.js'
import loadObj from './loadObj'



Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this
    
    
  


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () 
  {
   
  
    wx.downloadFile({
      url: '../mode/prediction.obj',
      success: 
      function(res){
      console.log('2')
      console.log(res)
      },
      fail:function(error){
        console.log('3')
        console.log(error)
        }


    })
    
    
  }


  ,
  touchStart(e) {
    console.log('canvas', e)
    THREE.global.touchEventHandlerFactory('canvas', 'touchstart')(e)
  },
  touchMove(e) {
    console.log('canvas', e)
    THREE.global.touchEventHandlerFactory('canvas', 'touchmove')(e)
  },
  touchEnd(e) {
    console.log('canvas', e)
    THREE.global.touchEventHandlerFactory('canvas', 'touchend')(e)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  chooseImage: function () {
    let that = this;
    //let worksImgs = that.data.worksImgs;
   // let len = that.data.worksImgs.length;
    var is_over=0
    wx.chooseImage({
        count: 9 , //最多选择9张图片
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            console.log(res);
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            if (res.tempFilePaths.count == 0) {
                return;
            }
            let tempFilePaths = res.tempFilePaths;
            // let token = app.data.uptoken;
            //上传图片 循环提交
            for (let i = 0; i < tempFilePaths.length; i++) {
              if(i==tempFilePaths.length-1){
                is_over=1
              }
                wx.uploadFile({
                    url: 'https://experimentforzcl.cn:7600', //此处换上你的接口地址 
                    filePath: tempFilePaths[i],
                    name: 'file',
                    formData:{'is_over':is_over},
                    success: function (res) {
                        console.log(res);
                        //let data = JSON.parse(res.data); // 这个很关键
                        //worksImgs.push(data.data.url);
                        //that.setData({
                            //worksImgs: worksImgs
                        //})
                        if(i==tempFilePaths.length-1){
                          console.log('最后一张')
                          var number = Math.floor(Math.random()*10);
                          that.setData({
                            obj_path: wx.env.USER_DATA_PATH + '/model' + number + '.obj'
                          })
                          
                          wx.getFileSystemManager().writeFile({
                            filePath: that.data.obj_path,
                            data: res.data,                            
                          })
                          console.log(that.data.obj_path)
                          wx.createSelectorQuery()
                          .select('#webgl')
                          .node()
                          .exec((res) => {
                          const canvas = new THREE.global.registerCanvas(res[0].node)
				                  loadObj(canvas, THREE,that.data.obj_path)
        
    })


                        }
                    }
                })
            }

        }
    })
},

})

