//var express = require('express');
//var app = express();
//var serveStatic = require('serve-static');
//var path = require('path');
//var ALY = require('aliyun-sdk');
//var sts = new ALY.STS({
//      accessKeyId: '1lFtmQ4WJpxy2kvS',
//      secretAccessKey: 'tic8UXpwLZSqyATpZDi3VcVowdQfQz',
//      endpoint: 'https://sts.aliyuncs.com',
//      apiVersion: '2015-04-01'
//    }
//);
//
//app.use(serveStatic(__dirname, {'index': ['demo.html']}));
//
//// STS 文档 http://docs.aliyun.com/#/pub/ram/sts-user-guide/intro
//app.get('/token', function (req, res) {
//  sts.getFederationToken({
//    StsVersion: '1',
//    Action: 'GetFederationToken',
//    Name: 'username',
//    // policy 规则文档: http://docs.aliyun.com/#/pub/ram/ram-user-guide/policy_reference&struct_def
//    Policy: '{"Version":"1","Statement":[{"Effect":"Allow", "Action":"*", "Resource":"*"}]}',
//    DurationSeconds: 3000
//  }, function (err, data) {
//    if(err) {
//      return res.send(500, err);
//    }
//
//    res.json(data);
//  });
//});
//
//var server = app.listen(3000, function () {
//
//  var host = server.address().address;
//  var port = server.address().port;
//
//  console.log('Example app listening at http://%s:%s', host, port);
//
//});