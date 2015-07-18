/**
 * @file yunpian
 * @module light.bridge.sms.yunpian
 * @author qiou_kay@163.com
 * @version 1.0.0
 */

"use strict";


var light    = require("light-core")
  , conf     = light.framework.config
  , request  = light.util.request
  , errors   = light.framework.error
  , _        = light.util.underscore
  , async    = light.util.async
  , constant = require("./constant");

/**
 * @desc 获取账户信息
 * @param callback
 */
exports.getAccountInfo = function (callback) {

  var data = {
    apikey: conf.sms_apikey
  };

  request.post({
    url : constant.SMS_ACCOUNT_INFO_YP,
    form: data
  }, function (e, r, body) {
    if (e) {
      return callback(e);
    }
    if (!body) {
      return callback(new errors.http.InternalServer());
    }

    try {
      body = JSON.parse(body);
    } catch (e) {
    }

    if (body.code != 0) {
      callback({code: body.code, message: body.msg});
    } else {
      callback(undefined, body.user);
    }
  });
};

/**
 * @desc 创建模板
 * @param {String} tpl_content 模板内容，必须以带符号【】的签名结尾，必须项
 * @param {Number} notify_type 审核结果短信通知的方式:<br>
 * 0表示需要通知,默认;<br>
 * 1表示仅审核不通过时通知;<br>
 * 2表示仅审核通过时通知;<br>
 * 3表示不需要通知<br>
 * @param callback
 */
exports.createTemplate = function (tpl_content, notify_type, callback) {

  if (notify_type instanceof Function && _.isUndefined(callback)) {
    callback = notify_type;
    notify_type = 0;
  }

  var data = {
    apikey     : conf.sms_apikey,
    tpl_content: tpl_content,
    notify_type: notify_type
  };

  request.post({
    url : constant.SMS_TEMPLATE_ADD_YP,
    form: data
  }, function (e, r, body) {
    if (e) {
      return callback(e);
    }
    if (!body) {
      return callback(new errors.http.InternalServer());
    }

    try {
      body = JSON.parse(body);
    } catch (e) {
    }

    if (body.code != 0) {
      callback({code: body.code, message: body.msg});
    } else {
      callback(undefined, body.template);
    }
  });
};

/**
 * @desc 获取模板
 * @param {Number} tpl_id 模板id，不传则返回全部模板
 * @param callback
 */
exports.getTemplates = function (tpl_id, callback) {

  // 获取所有模板
  if (tpl_id instanceof Function && _.isUndefined(callback)) {
    callback = tpl_id;
    tpl_id = undefined;

    var getDefaultTemplates = function (ok) {
      getTemplate(constant.SMS_TEMPLATE_DEFAULT_YP, tpl_id, ok);
    };

    var getCustomTemplates = function (ok) {
      getTemplate(constant.SMS_TEMPLATE_GET_YP, tpl_id, ok);
    };

    async.parallel([getDefaultTemplates, getCustomTemplates], function (err, results) {
      if (err) {
        return callback(err);
      }

      var templates = [];
      if (results && results.length > 1) {
        templates = _.union(results[0], results[1]);
      }
      callback(undefined, templates);
    });
  }
  // 获取指定模板
  else {
    getTemplate(constant.SMS_TEMPLATE_GET_YP, tpl_id, callback);
  }
};

/**
 * @desc 获取template
 * @param {String} url 获取默认/用户定义的模板的url
 * @param {Number} tpl_id 模板id
 * @param cb
 * @ignore
 */
var getTemplate = function (url, tpl_id, cb) {

  var data = {
    apikey: conf.sms_apikey,
    tpl_id: tpl_id
  };

  request.post({
    url : url,
    form: data
  }, function (e, r, body) {
    if (e) {
      return cb(e);
    }
    if (!body) {
      return cb(new errors.http.InternalServer());
    }

    try {
      body = JSON.parse(body);
    } catch (e) {
    }

    if (body.code != 0) {
      cb({code: body.code, message: body.msg});
    } else {
      cb(undefined, body.template);
    }
  });
};

/**
 * @desc 发送短信
 * @param {String} mobile 接收的手机号;群发时多个手机号以逗号分隔，一次不要超过100条，群发需要审核才能开放
 * @param {String} text 短信内容
 * @param callback
 */
exports.send = function (mobile, text, callback) {

  var data = {
    apikey: conf.sms_apikey,
    mobile: mobile,
    text  : text
  };

  request.post({
    url : constant.SMS_SEND_YP,
    form: data
  }, function (e, r, body) {
    if (e) {
      return callback(e);
    }
    if (!body) {
      return callback(new errors.http.InternalServer());
    }

    try {
      body = JSON.parse(body);
    } catch (e) {
    }

    if (body.code != 0) {
      callback({code: body.code, message: body.msg});
    } else {
      callback(undefined, body.result);
    }
  });
};
