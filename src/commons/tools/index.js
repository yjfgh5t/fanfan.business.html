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
    let callKey = Tools.getCallBackKey(callback)
    // 调用后台方法
    if (method == "get") {
      Tools.app.ajaxGet(url, paramsMap, callKey)
    } else {
      Tools.app.ajaxPost(url, paramsMap, callKey)
    }
  },
  // 获取参数
  getKeyVal: function (key, callback) {
    Tools.app.getKeyVal(key, Tools.getCallBackKey(callback))
    // Toast("dddd")
  },
  // 蓝牙操作
  blueTooth: function (start, callback) {
    Toast("消息"+start)
    Tools.app.blueTooth(start, Tools.getCallBackKey(callback))
  },
  getCallBackKey: function (callback) {
    // 回调放入临时callMap
    let callKey = "call_back_" + (Tools.callKeyIndex++)
    Tools.callMap[callKey] = callback
    return callKey
  },
  // App回调
  callback: function (jsonString, callKey) {
    // 关闭加载条
    Indicator.close()
    if (typeof jsonString == 'string') {
      // 执行回调
      Tools.callMap[callKey](jsonString)
    } else {
      if (jsonString.success && jsonString.code == 0) {
        // 执行回调
        Tools.callMap[callKey](jsonString)
      } else {
        // 错误提示
        Toast(jsonString.msg)
      }
    }
  }
}

// 注册回调
window.callback = Tools.callback

export default Tools
