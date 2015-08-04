/**
 * @file sms
 * @module light.bridge.sms
 * @author qiou_kay@163.com
 * @version 1.0.0
 */

var conf = light.framework.config
  , helper = light.framework.helper
  , error = light.framework.error
  ;

/**
 * @desc 获取账户信息
 * @param callback
 */
exports.getAccountInfo = function (callback) {
  callMethod("getAccountInfo", [], callback);
};

/**
 * @desc 发送短信
 * @param {String} mobile 手机号
 * @param {String} content 短信内容
 * @param callback
 */
exports.send = function (mobile, content, callback) {
  callMethod("send", [mobile, content], callback);
};

/**
 * @desc 创建短息模板
 * @param {String} tpl_content 模板内容
 * @param {String} notify_type 提醒类型
 * @param callback
 */
exports.createTemplate = function (tpl_content, notify_type, callback) {
  callMethod("createTemplate", [tpl_content, notify_type], callback);
};

/**
 * @desc 选择模板
 * @param {Number} tpl_id 模板ID
 * @param callback
 */
exports.getTemplates = function (tpl_id, callback) {
  callMethod("getTemplates", [tpl_id], callback);
};

function callMethod (method, params, callback) {
  var smsService = conf.sms_service || "yunpian";

  var sms = helper.resolve(smsService, __dirname + "/");
  try {
    params.push(callback);
    sms[method].apply(this, params);
  } catch (e) {
    callback(new error.class.MethodNotFoundError("can not found " + method + " method. sms service: " + smsService));
  }
}