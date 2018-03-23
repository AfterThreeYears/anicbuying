const fs = require('fs');
const path = require('path');
const util = require('util');
const axios = require('axios');
const qs = require('qs');
const { execSync } = require('child_process')
const readlineSync = require('readline-sync');
const { RSAUtils } = require('./security');
const list = require('./mima.json');

const writeFileAsync = util.promisify(fs.writeFile);
const userCookie = {};
const initCookie = '_ga=GA1.2.28110083.1519563668; _gid=GA1.2.320690233.1519563668; Hm_lvt_7226b8c48cd07619c7a9ebd471d9d589=1517796347; sr=334.127.201.43.11.3.115.238.87.99.0.33.20.15.07; lcksid=5a940dbf164e64007c1d0b1e; _gat=1;JSESSIONID=55CCA2680A46B2EA683D7950628ECE45.t-9003; Hm_lpvt_7226b8c48cd07619c7a9ebd471d9d589=1519652399 SESSIONID=${SESSIONID};';

const headers = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'zh-CN,zh;q=0.9',
  Connection: 'keep-alive',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  Host: 'www.xiaoniu88.com',
  Origin: 'https://www.xiaoniu88.com',
  Cookie: initCookie,
  Referer: 'https://www.xiaoniu88.com/user/login?url=https://www.xiaoniu88.com/neo/pc/5a3b5f0094619845d13f1b92/html/1.html?ch=pc',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36',
  'X-Requested-With': 'XMLHttpRequest',
};

const initInstance = (state) => {
  if (state) headers.Accept = 'application/json, text/javascript, */*; q=0.01';
  return axios.create({
    headers,
  });
};

const instance = initInstance();

const getToken = async () => {
  try {
    const res = await instance.get('https://www.xiaoniu88.com/user/login');
    const SESSIONID = res.headers['set-cookie'][0].match(/SESSIONID=(.+?);/)[1];
    console.log(`SESSIONID是${SESSIONID}`, res.headers['set-cookie']);
    headers.Cookie = headers.Cookie.replace('${SESSIONID}', SESSIONID);
    const data = res.data;
    const name = data.match(/name="ooh.token.name"\svalue="(.+)"/)[1];
    const value = data.match(/name="ooh.token.value"\svalue="(.+)"/)[1];
    return {
      name,
      value,
    }
  } catch (error) {
    console.log(`解析html发生错误, ${error.message}`);
    process.exit(1);
  }
};

const downImg = async () => {
  return new Promise(async (resolve) => {
    const ws = fs.createWriteStream('/tmp/captch.png');
    const url = `https://www.xiaoniu88.com/user/captcha?${Date.now()}`;
    const option = {
        headers,
        responseType: 'stream'
    };
    console.log('发送请求');
    let res;
    try {
      res = await axios.get(url, option);
    } catch (error) {
      console.error('请求验证码失败', error.message);
      process.exit(1);
    }
    res.data.pipe(ws);
    res.data.on('end', () => {
      // 打开图片
      execSync('open /tmp/captch.png');
      resolve();
    });
  });
};

const main = async ({ username, password }) => {
  console.log('1. 获取token');
  const { name, value } = await getToken();
  console.log('2. 获取验证码');
  await downImg();
  const code = readlineSync.question('请问验证码是什么');
  const body = {
    'ooh.token.name': name,
    'ooh.token.value': value,
    username,
    password: RSAUtils.pwdEncode(password),
    code,
  };
  console.log('发送的用户信息为', util.inspect(body));
  console.log('3. 请求登录');
  const instance = initInstance(1);
  const url = `https://www.xiaoniu88.com/user/login?${Date.now()}`;
  const res = await instance.post(url, qs.stringify(body));
  console.log(res);
  userCookie[username] = res.headers['set-cookie'];
  if (list.length) {
    headers.Cookie = initCookie;
    main(list.shift());
  } else {
    await writeCookie();
    process.exit(0);
  }
};

const writeCookie = async () => {
  for(let key in userCookie) {
    userCookie[key] = (userCookie[key].map(item => item.replace('Path=/; HttpOnly', '')).join(''));
  }
  const data = `module.exports = ${JSON.stringify(userCookie).trim()};`;
  console.log('写入文件为', data);
  try {
    await writeFileAsync(path.join(__dirname, './cookie.js'), data);
  } catch (error) {
    console.log('cookie写入失败', error.message);
  }
  console.log('cookie写入完成');
}

main(list.shift());
