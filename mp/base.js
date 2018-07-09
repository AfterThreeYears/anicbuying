const axios = require('axios');
const format = require('date-fns/format');
const isTest = process.env.NODE_ENV === 'test';

const checkTime = () => {
  const m = +format(new Date(), 'mm');
  const s = +format(new Date(), 'ss');
  if (
    (m === 59 && s >= 59) ||
    (m <= 1 && s <= 55)
  ) return true;
}

const main = ({start, end, cb, gapTime}) => {
  setInterval(() => {
    if (checkTime() || isTest) {
      cb();
    }
  }, gapTime);
};

const sendRequest = ({headers, url, body, params, method, msg}) => {
  const time = Date.now() || format(new Date(), 'YYYY/MM/DD HH:mm:ss');
  const instance = axios.create({
    timeout: 5000,
    headers,
  });
  let requestPromise;
  if (method === 'post') {
    requestPromise = instance.post(url, body);
  } else {
    requestPromise = instance.get(url, {params});
  }
  try {
    requestPromise
    .then(function (response) {
      let gap;
      try {
        gap = Date.now() - (response.data.serverTime || response.data.serverDateTime);
      } catch (error) {
        
      }
      console.log(`${gap},,,,${time}--${msg} ${JSON.stringify(response.data)}`);
    })
    .catch(function (error) {
      console.log(`${time}--出错了---${msg}---${JSON.stringify(error)}`);
    });
  } catch (error) {
    console.log('出现错误！！', error);
  }
}

module.exports = {
  main,
  checkTime,
  sendRequest,
};
