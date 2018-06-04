import { Indicator } from 'mint-ui'

let Tools = {
  app: ((window.fanfan && window.fanfan.android)||{ ajax: function (method, url, paramsMap, callKey) { window.setTimeout(()=>{window.callback({}, callKey) },500) }}),
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
    let callKey = "call_back_"+ (Tools.callKeyIndex++);
    Tools.callMap[callKey]=callback;
    // 调用后台方法
    Tools.app.ajax(method, url, paramsMap, callKey)
  },
  // App回调
  ajaxCallback: function (data, callKey) {
    // 关闭加载条
    Indicator.close()
    if (Tools.callMap[callKey] != undefined) {
      // 执行回调
      Tools.callMap[callKey](data)
    }
  }
}

// 注册回调
window.callback = Tools.ajaxCallback

export default Tools
