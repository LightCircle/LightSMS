/**
 * @file ihuiyi
 *   互亿 http://ihuyi.com/
 * @module light.bridge.sms.yunpian
 * @author qiou_kay@163.com
 * @version 1.0.0
 */

"use strict";


var light     = require("light-core")
  , config    = light.framework.config
  , request   = light.util.request
  , log       = light.framework.log
  , _         = light.util.underscore
  , constant  = require("./constant")
  , parse     = require("xml-parser")
  ;


/**
 * @desc 发送短信
 * @param {Object} option
 *   option.mobile 接收号码，只能提交1个号码
 *   option.content 300个字的长短信
 *   option.account 提交账户
 *   option.password 提交账户密码
 * @param callback
 */
exports.send = function (option, callback) {

  option.account = option.account || config.sms.account;
  option.password = option.password || config.sms.password;

  request.post({
    url: constant.SMS_SEND_HUIYI, form: option
  }, function (err, response, body) {

    if (err) {
      log.error(err);
      return callback(err);
    }

    var xml = parse(body)
      , code = _.findWhere(xml.root.children, {name: "code"})
      , msg = _.findWhere(xml.root.children, {name: "msg"})
      , smsid = _.findWhere(xml.root.children, {name: "smsid"});

    if (code.content == "2") {
      return callback(null, {smsid: smsid.content});
    }

    callback({code: code.content, msg: msg.content});
  });
};
