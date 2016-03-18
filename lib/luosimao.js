/**
 * @file luosimao
 *   螺丝帽 https://luosimao.com/
 * @module light.bridge.sms.luosimao
 * @author qiou_kay@163.com
 * @version 1.0.0
 */

"use strict";

var conf = light.framework.config
  , constant = require("./constant")
  , https = require('https')
  , querystring = require('querystring');

/**
 * @desc 获取账户信息
 * @param callback
 */
exports.getAccountInfo = function (callback) {

  var options = {
    host: constant.SMS_HOST_LSM,
    path: constant.SMS_ACCOUNT_INFO_LSM,
    method: 'GET',
    auth: conf.sms.apikey,
    agent: false,
    rejectUnauthorized: false
  };

  var req = https.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      try {
        chunk = JSON.parse(chunk);
      } catch (e) {
      }

      if (chunk.error != 0) {
        callback({code: chunk.error, message: chunk.msg});
      } else {
        callback(undefined, chunk);
      }
    });
  });

  req.on('error', function (e) {
    callback(e);
  });

  req.end();
};

/**
 * @desc 发送短信
 * @param {String} mobile 电话号码
 * @param {String} message 发送内容
 * @param callback
 */
exports.send = function (mobile, message, callback) {

  var content = querystring.stringify({
    mobile: mobile,
    message: message
  });

  var options = {
    host: constant.SMS_HOST_LSM,
    path: constant.SMS_SEND_LSM,
    method: 'POST',
    auth: conf.sms.apikey,
    agent: false,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': content.length
    }
  };

  var req = https.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      try {
        chunk = JSON.parse(chunk);
      } catch (e) {
      }

      if (chunk.error != 0) {
        callback({code: chunk.error, message: chunk.msg});
      } else {
        callback(undefined, chunk);
      }
    });
  });

  req.on('error', function (e) {
    callback(e);
  });
  req.write(content);
  req.end();
};
