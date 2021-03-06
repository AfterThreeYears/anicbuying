const config = require('./config1');
const {main, sendRequest} = require('./base');

for(const key in config) {
  config[key].forEach((item) => {
    const {gapTime, start, end} = item;
    main({
      gapTime,
      start,
      end,
      cb() {
        sendRequest(item);
      }
    })
  });
}

