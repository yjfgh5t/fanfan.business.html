import { Indicator, Toast  } from 'mint-ui'

let Tools = {
  app: ((window.android)||{ ajaxPost: function (method, url, paramsMap, callKey) { window.setTimeout(()=>{window.callback("{'code':-1,'success':false}", callKey) },500) }}),
  callMap:{},
  global:{},
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
      paramsMap = params === null ? {} : params
    }
    // 回调放入临时callMap
    let callKey = Tools.getCallBackKey(callback)
    // 调用后台方法
    if (method == "get") {
      Tools.app.ajaxGet(url, JSON.stringify(paramsMap), callKey)
    } else {
      Tools.app.ajaxPost(url, JSON.stringify(paramsMap), callKey)
    }
  },
  // 获取参数
  getKeyVal: function (key, callback) {
    Tools.app.getKeyVal(key, Tools.getCallBackKey(callback))
    // Toast("dddd")
  },
  // 设置参数
  setKeyVal: function (key, val, callback) {
    Tools.app.setKeyVal(key, val, Tools.getCallBackKey(callback))
  },
  // 蓝牙操作
  blueTooth: function (start, callback) {
    Tools.app.blueTooth(start, Tools.getCallBackKey(callback))
  },
  // 获取回调方法key
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
  },
  // 全局变量
  globalParams: function (key, val) {

    if (val == undefined) {
      return Tools.global[key]
    }
    Tools.global[key] = val
  }
}

// 注册回调
window.callback = Tools.callback

export default Tools
