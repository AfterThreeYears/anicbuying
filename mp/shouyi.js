const axios = require('axios');
const url = 'https://m.meipu.cn/mobile/brokerage/queryIncome';

const generatorText = ({
  deposits,
  expectDeposits,
  totalRevenue,
}) => `一共收益${totalRevenue}，可用${deposits}，待用${expectDeposits}`;

const handleFetchPrice = (arr) => {
  const promiseList = arr.map(async ({ account, token }) => {
    return await axios.create({
      headers: {
        'access-token': token,
        'X-account': account,
      },
    }).post(url);
  });
  Promise.all(promiseList)
    .then((priceList) => {
      console.log(priceList.map(({ config, data }) => ({
        account: config.headers['X-account'],
        data: generatorText(data.data),
      })));
    })
    .catch((error) => {
      console.log('请求失败', error);
    });
};

handleFetchPrice(require('./shoujsData.js'));