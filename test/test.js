/**
 * @file 测试代码
 * @module light.bridge.sms.test.test
 * @author r2space@gmail.com
 * @version 1.0.0
 */

var sms = require("./../index");

/**
 * 互亿测试代码
 *  content 需要事先在系统中定义
 */
sms.ihuyi.send({
  account: "cf_yeezhan",
  password: "yeezhan",
  mobile: "18640852861",
  content: "您的验证码是：【1010110】。请不要把验证码泄露给其他人。如非本人操作，可不用理会！"
}, function(err, result) {
  console.log(err, result);
});
