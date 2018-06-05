import { Indicator, Toast  } from 'mint-ui'

let Tools = {
  app: ((window.android)||{ ajaxPost: function (method, url, paramsMap, callKey) { window.setTimeout(()=>{window.callback("{'code':-1,'success':false}", callKey) },500) }}),
  callMap:{},
  callKeyIndex:1,
  // 调用Ajax
  ajax: function (method, url, params, callback) {
    // 加载条
    Indicator.open({spinnerType: 'double-bounce'})

    // 构建参数
    let paramsMap = {}
    if (method == "json") {
      paramsMap["content-type"] = "json"
      paramsMap["content"] = JSON.stringify(params)
    } else {
      paramsMap = params
    }
    // 回调放入临时callMap
    let callKey = "call_back_" + (Tools.callKeyIndex++)
    Tools.callMap[callKey] = callback
    // 调用后台方法
    if (method == "get") {
      Tools.app.ajaxGet(url, paramsMap, callKey)
    } else {
      Tools.app.ajaxPost(url, paramsMap, callKey)
    }
  },
  // App回调
  ajaxCallback: function (jsonString, callKey) {
    // 关闭加载条
    Indicator.close()

    console.log(jsonString)
    let jsonData = JSON.parse(jsonString)

    if (jsonData.success) {
      if (jsonData.code==0) {
        // 执行回调
        Tools.callMap[callKey](jsonData)
      }
    } else {
      // 错误提示
      Toast({message: jsonData.message, duration: 2500})
    }
  }
}

// 注册回调
window.callback = Tools.ajaxCallback

export default Tools
