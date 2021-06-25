// pages/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    validateCodePath:"",
    imgSrc :"",
    name:"",
    choose:false,
    flag1: '0',
    flag2:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  
  onChange1(event) {
    this.setData({
      flag1: event.detail,
    });
  },onChange2(event) {
    this.setData({
      flag2: event.detail,
    });
  },
//   img:function() {
//     var _this = this
   
//   wx.chooseImage({
    
//     success (res) {
//       const tempFilePaths = res.tempFilePaths
//       console.log(tempFilePaths[0])
//       _this.setData({
//         imgSrc : tempFilePaths
//       })
//       wx.uploadFile({
//         url: 'https://experimentforzcl.cn:7600', //仅为示例，非真实的接口地址
//         filePath: tempFilePaths[0],
//         name: 'file',
//         formData:{
//           'flag1':_this.data.flag1,
//            'flag2':_this.data.flag2
//           },
//         success (res){
         
//           // setTimeout(function (){},300)
//           const data = res.data
          
//           console.log(res.data)
         
//           _this.setData({
//             imgSrc: "data:image/png;base64," + res.data,
            
//             // changeStyle: false,
//           })
//           var number = Math.random();
//           wx.getFileSystemManager().writeFile({
//             filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
//             data: _this.data.list[numvalue].proUrl.slice(22),
//             encoding: 'base64',
//           })
          
//            console.log(_this.data.imgSrc)
//       }
//     })
//   }
// })
// }
chooseimg: function() {
  var _this = this
  wx.chooseImage({
    success (res) {
      
      _this.setData({
        imgSrc: res.tempFilePaths[0],
        // [temp2]: res.tempFilePaths[0],
        choose: true,
      })
      Notify({
        type: 'success',
        message: '选择成功',
        duration: 1000,
      });
    }
  })
},


generate: function() {
  var _this = this
  if(this.data.choose==false){ 
    wx.showToast({
      title: '请选择图片',
      icon: 'none',
    })
  }else{
    var numvalue = _this.data.current
    wx.showLoading({
      title: '生成图片中...',
    })
    
    wx.uploadFile({
      url: 'https://experimentforzcl.cn:7600',
      filePath: _this.data.imgSrc,
      name: 'file',
      formData:{'flag1':_this.data.flag1,
      'flag2':_this.data.flag2
        },
      success (res){
        
         console.log(res.data)
          _this.setData({
            proUrl: "data:image/png;base64," + res.data,
            
            
          })

          var number = Math.random();
          var timestamp = Date.parse(new Date());
          var date = new Date(timestamp);
          var time = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + "\t" + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())

          wx.getFileSystemManager().writeFile({
            filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
            data: _this.data.proUrl.slice(22),
            encoding: 'base64',
          })
          // wx.cloud.uploadFile({
          //   cloudPath: 'history/'+number+'.png',
          //   filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
          //   success: res => {
          //     db.collection('history').add({
          //       data: {
          //         time: time,
          //         imgsrc: 'cloud://charlie-9mgmr.6368-charlie-9mgmr-1301103640/history/'+number+'.png',
          //         style: numvalue,
          //       }
          //     })
          //   },
          // })
          wx.hideLoading(),
          Notify({
            type: 'success',
            message: '生成成功',
            duration: 1000,
          });
        
      }
    })
  }
},




})

