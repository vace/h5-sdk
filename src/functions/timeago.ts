const indexMapZh = '秒_分钟_小时_天_周_月_年'.split('_')
// build-in locales: en & zh_CN
const zh_CN = function (number: number, index: number) {
  if (index === 0) return ['刚刚', '片刻后']
  const unit = indexMapZh[toInt(index / 2)]
  return [number + unit + '前', number + unit + '后']
}
// second, minute, hour, day, week, month, year(365 days)
const SEC_ARRAY = [60, 60, 24, 7, 365 / 7 / 12, 12]
const SEC_ARRAY_LEN = 6

// change f into int, remove Decimal. just for code compression
function toInt (f: number): number {
  return Math.floor(f)
}
// format the diff second to *** time ago, with setting locale
function formatDiff(diff: number) {
  var i = 0
  var agoin = diff < 0 ? 1 : 0 // timein or timeago
  diff = Math.abs(diff)
  for (; diff >= SEC_ARRAY[i] && i < SEC_ARRAY_LEN; i++) {
    diff /= SEC_ARRAY[i]
  }
  diff = toInt(diff)
  i *= 2
  if (diff > (i === 0 ? 9 : 1)) i += 1
  return zh_CN(diff, i)[agoin].replace('%s', '' + diff)
}
// calculate the diff second between date to be formated an now date.

/**
 * 美化表示Unix时间戳，注意参数为时间戳
 * @param {number} unixTime 允许`Date`类型参数
 * @returns {string} 美化后的时间描述，如“3小时前”
 */
export function timeago (unixTime: Date | number): string {
  if (unixTime instanceof Date) unixTime = unixTime.getTime() / 1000
  let diff = Date.now() / 1000 - unixTime
  return formatDiff(diff)
}


// 需要替换的正则表达式
const REPLACE_REGEX = /(Y|M|D|H|I|S|T)/ig

/**
 * 格式化时间点
 * @param {number} unixTime  unix时间戳
 * @param {string} [format='Y-M-D H:i:s'] 格式化格式
 */
export function unixFormat (unixTime: number, format = 'Y-M-D H:i:s'): string {
  var time = new Date(unixTime && unixTime * 1000)
  var conf: any = {
    Y: time.getFullYear(),
    M: pad(time.getMonth() + 1), //月份 
    D: pad(time.getDate()), //日 
    H: pad(time.getHours()), //小时 
    I: pad(time.getMinutes()), //分 
    S: pad(time.getSeconds()), //秒 
    T: time.getTime()
  }
  return format.replace(REPLACE_REGEX, key => conf[key.toUpperCase()])
}

function pad(num: number) {
  return num < 10 ? `0${num}` : num.toString()
}
