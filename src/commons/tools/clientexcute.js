import { Indicator, Toast, MessageBox } from 'mint-ui'
import Tools from '@/commons/tools/index'
let Client = {
  // 链接蓝牙
  blueToothConnect: function (hasAutoConnect) {
    // 链接蓝牙
    Tools.getKeyVal(Tools.globalKey.autoPrint, function (print) {
      if (print === 'true' || (hasAutoConnect === undefined || hasAutoConnect === false)) {
        Tools.getKeyVal(Tools.globalKey.blueToothConnect, function (data) {
          // 获取链接的蓝牙设备
          if (data.indexOf(';') > 0) {
            let blueStr = data.split(';')
            // 执行链接蓝牙
            Tools.blueConnect(blueStr[1])
          }
        })
      }
    })
  }
}

export default Client
