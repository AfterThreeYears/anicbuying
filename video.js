const superagent = require('superagent');
const cheerio = require('cheerio');

const regexp = (url) => {
  if (url.includes('5x/480')) {
    url = url.replace(/.com\/.*\/tumblr/, '/tumblr').replace(/\/\/(.*)tumblr\//, '//vt.media.tumblr.com\/').replace(/5x\/480/, '5x_480.mp4')
  } else {
    url = url.replace(/.com\/.*\//, '/').replace(/\/\/(.*)tumblr\//, '//vt.media.tumblr.com\/') + '.mp4'
  }
  return url;
}

const main = (index) => {
  superagent
    .get(`https://www.tumblr.com/search/${encodeURIComponent('')}`)
    .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
    .set('Accept-Language', 'zh-CN,zh;q=0.9')
    .set('Host', 'www.tumblr.com')
    .set('Cookie', 'search_post_view=grid; tmgioct=5a539419d17a600227165610; __utmc=189990958; __utmz=189990958.1515426860.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _ga=GA1.2.9971295.1515426860; _gid=GA1.2.1200265208.1515426860; rxx=39x8t4hmpe4.ze3fax6&v=1; yx=stdhas5pbz6ew%26o%3D3%26f%3Dv0; devicePixelRatio=2; anon_id=ZUTBWPGTSLCLRVDRNZHTRPIPGGYTQGFG; capture=%211231515426841%7CZ39cewGh4FkcPetdWoHvd0R6PA; __utma=189990958.9971295.1515426860.1515426860.1515508373.2; __utmb=189990958.0.10.1515508373; documentWidth=1275; pfs=whQ3rjlkxhJH9csdtJRONe8fk')
    .set('Content-Type', 'text/html; charset=utf-8')
    .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36')
    .then(function (response) {
      var html = response.text;
      var $ = cheerio.load(html, {decodeEntities: false});
      const list = Array.from($('video source')).map(item => regexp(item.attribs.src));
      console.log(list);
      index++;
      // main(index)
    })
    .catch(function (error) {
      console.log('出错了', error);
    });
};

main(1);
