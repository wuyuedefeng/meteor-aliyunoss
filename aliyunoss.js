// Write your package code here!
ItrydoAliYunOSS = {
    // Local (client-only) collection
    ossUpload: {},
    init: function () {
            ossUpload = new OssUpload({
            bucket: AliyunOSS_Config.bucket,
            // 根据你的 oss 实例所在地区选择填入
            // 杭州：http://oss-cn-hangzhou.aliyuncs.com
            // 北京：http://oss-cn-beijing.aliyuncs.com
            // 青岛：http://oss-cn-qingdao.aliyuncs.com
            // 深圳：http://oss-cn-shenzhen.aliyuncs.com
            // 香港：http://oss-cn-hongkong.aliyuncs.com
            endpoint: AliyunOSS_Config.endpoint,
            // 如果文件大于 chunkSize 则分块上传, chunkSize 不能小于 100KB 即 102400
            chunkSize: AliyunOSS_Config.chunkSize,
            // 注意: 虽然使用 accessKeyId 和 secretAccessKey 可以进行上传, 但是存在泄露风险, 因此强烈建议使用下面的 STS token
            // 只有在确认不会出现泄露风险的情况下, 才使用 aliyunCredential
            aliyunCredential: AliyunOSS_Config.credential
            //stsToken: AliyunOss_stsToken
            // 这是一个 stsToken 的样例
            //    {
            //      "FederatedUser": {
            //      "FederatedUserId": "31611321:chylvina",
            //          "Arn": "acs:sts::31611321:federated-user/chylvina"
            //      },
            //      "RequestId": "06F7B497-4F66-48FC-9966-F6977C410543",
            //        "Credentials": {
            //          "AccessKeySecret": "YxPglqqauWmCB5JrVtQkUvEgzl5t10tISDR7mg1C",
            //          "AccessKeyId": "STS.c7HAijcjQ6qTBIg3RGNh",
            //          "Expiration": "2015-06-29T04:38:28.262Z",
            //          "SecurityToken": "CAESjgIIARKAAaPivErZqHb6/mG7o9Llu8mV70sVOrIMB5b0i/coA1MtAUa7M+Psvh62fnMAisp0Pvclzcg7EgJok8mBSNK3khAtKDhsN/915oQm9Flx5/PFYbjexVPzgxw6QgJ/a0GGMtKnpydlQ9q5JWekpumDCM/8sAsQwlNRX4rBmUqca+oCGhhTVFMuYzdIQWlqY2pRNnFUQklnM1JHTmgiCDMxNjExMzIxKghjaHlsdmluYTCm7e/s4yk6BlJzYU1ENUJKCgExGkUKBUFsbG93EhsKDEFjdGlvbkVxdWFscxIGQWN0aW9uGgMKASoSHwoOUmVzb3VyY2VFcXVhbHMSCFJlc291cmNlGgMKASo="
            //      }
            //    }

        });
    },
    upload_one: function(one_file,successCallback,failCallback){
        file_name = this.randomString();
        one_file = this.convertBase64UrlToBlob(one_file);
        ossUpload.upload({
            // 必传参数, 需要上传的文件对象
            file: one_file,
            // 必传参数, 文件上传到 oss 后的名称, 包含路径
            key: file_name,
            // 上传失败后重试次数
            maxRetry: 3,
            // OSS支持4个 HTTP RFC2616(https://www.ietf.org/rfc/rfc2616.txt)协议规定的Header 字段：
            // Cache-Control、Expires、Content-Encoding、Content-Disposition。
            // 如果上传Object时设置了这些Header，则这个Object被下载时，相应的Header值会被自动设置成上传时的值
            // 可选参数
            headers: {
                'CacheControl': 'public',
                'Expires': '',
                'ContentEncoding': '',
                'ContentDisposition': '',
                // oss 支持的 header, 目前仅支持 x-oss-server-side-encryption
                'ServerSideEncryption': ''
            },
            // 文件上传失败后调用, 可选参数
            onerror: function (evt) {
                //console.log(evt);
                if (failCallback){
                    failCallback();
                }
            },
            // 文件上传成功调用, 可选参数
            oncomplete: function (res) {
                if(successCallback){
                    successCallback(file_name);
                }
            }
        });
    },
    upload_more: function(files,successCallback,failCallback){
        var all_num = files.length;
        var successNum = 0;
        var successFileNames = [];
        var failNum = 0;
        for(var i = 0; i< all_num; i++){
            var one_file = files[i];
            this.upload_one(one_file,function(file_name){
                successNum ++ ;
                successFileNames.push(file_name);
                if(successNum == all_num){
                    successCallback(successFileNames);
                    successFileNames = null;
                    return ;
                }
            },function(){
                failCallback();
                return ;
            });
        }
    },
    randomString:function(){
        var timestamp = new Date().getTime();
        var firstHalf = Meteor.userId() + timestamp;
        var  x = firstHalf;
        var  tmp="";

        for(var  i=0;i < 10;i++)  {
            tmp  +=  x.charAt(Math.ceil(Math.random()*100000000)%x.length);
        }
        return firstHalf + tmp;
    },
    convertBase64UrlToBlob: function (urlData){
        var objReg=/^data:image/i;
        if(objReg.test(urlData)){
            var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte

            //处理异常,将ascii码小于0的转换为大于0
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }
            return new Blob( [ab] , {type : 'image/png'});
        }
        else{
            return urlData;
        }

    }
};

Meteor.startup(function () {
    ItrydoAliYunOSS.init();
});


