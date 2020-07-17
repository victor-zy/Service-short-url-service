const Service = require("egg").Service;
const crypto = require("crypto");

class UserService extends Service {

    /**
     * @description 通过长链接找到相应的短链接
     * @param {string} url origin_url  长链接
     */
    async find(url) {
        // console.log(url);
        var originurl = await this.crypto(url);
        console.log(originurl);
        var result1 = await this.app.mysql.get('origin_table',{origin_url_hash: originurl});
        var code = JSON.stringify(result1);
        code = JSON.parse(code);
        console.log(code);
        const short_url = "http://gd.com/" + code.short_url_code;

        return {
            origin_url: url,
            short_url: short_url,
        };
    }

    /**
     * @description 创建短链
     * @param {string} url 长链接 
     */
    async createshorturl(url,time) {
        console.log(url);
        console.log("选择的过期时间"+time);

        // 对url进行加密
        
        const origin_hash = await this.crypto(url);

        // 将url、加密结果、过期时间入库
        var result = await this.app.mysql.insert("origin_table", {
            origin_url: url,
            origin_url_hash: origin_hash,
        });
        var insertSucecess = result.affectedRows === 1;

        // 是否入库成功，成功为true
        if (insertSucecess) {
            // console.log("insertSucecess: " + insertSucecess);

            // 将得到的code从10进制转为62进制
            var code = await this.app.mysql.query(
                "select id from origin_table where origin_url_hash = ?",
                origin_hash
            );
            var id = code[0].id;
            var arr = await this.dec_to_62(id);

            // 将转化之后的62进制存入origin_table.short_url_code
            console.log(JSON.stringify(arr));
            const short_url_code1 = arr.join("");

            // 补充short_url_code

            const row = {
                short_url_code: short_url_code1,
            };
            const option = {
                where: {
                    origin_url_hash: origin_hash,
                },
            };
            var status = await this.app.mysql.update("origin_table",row,option);
            var updateSuccess = status.affectedRows === 1;
            if (updateSuccess) {
                // 获取刚刚那条记录
                const short_url_info = await this.app.mysql.get(
                    "origin_table",
                    { short_url_code: short_url_code1 }
                );
                // 拼接短链接
                var result2 = JSON.stringify(short_url_info);
                result2 = JSON.parse(result2);
                return {
                    id: result2.id,
                    short_url: 'http://gd.com/'+ result2.short_url_code,
                    origin_url: result2.origin_url
                }
            } else {
                console.log("短码更新失败");
            }
        } else {
            console.log("长链接入库失败！！！");
        }
    }

    /**
     * @description 对长链接进行加密
     * @param {string} url 
     * @returns sha1 
     */
    async crypto(url) {
        const hash = crypto.createHash("sha1");
        hash.update(url);
        const origin_hash = hash.digest("hex");
        return origin_hash;
    }

    /**
     * @description 10进制转62进制
     * @param {int} id 
     */
    async dec_to_62(id) {
        var chars = "0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ".split(
            ""
        );
        var radix = chars.length;
        var qutient = +id;
        var arr = [];
        do {
            var mod = qutient % radix;
            qutient = (qutient - mod) / radix;
            arr.unshift(chars[mod]);
        } while (qutient);

        return arr;
    }

    /**
     * @description 通过短码识别出来长码
     * @param {string} id 短链码
     */
    async search(id) {
        var result = await this.app.mysql.get('origin_table',{short_url_code: id});
        var redirect_url = JSON.stringify(result);
        redirect_url = JSON.parse(redirect_url);

        return redirect_url.origin_url;
    }
}

module.exports = UserService;
