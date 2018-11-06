var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'POST':
            var item = '';
            req.setEncoding('utf-8'); // 将进来的data事件编码为UTF-8字符串
            req.on('data', function (chunk) {
                item += chunk;
            })
            req.on('end', function () {
                items.push(item); // 将完整的新事项压入事项数组中
                res.end('OK\n');
            })
            break;
        case 'GET':
            var body = items.map(function(item, i) {
                return `${i}) ${item}`;
            }).join('\n');
            res.setHeader('Content-Length', Buffer.byteLength(body));
            res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
            res.end(body);
            break;
        case 'DELETE':
            var path = url.parse(req.url).pathname;
            var i = parseInt(path.slice(1), 10);

            if (isNaN(i)) {
                res.statusCode = 400;
                res.end('Invalid item id');
            } else if (!items[i]) {
                res.statusCode = 404;
                res.end('Item not found');
            } else {
                items.splice(i, 1);
                res.end('OK\n');
            }
            break;
        case 'PUT':
            var path = url.parse(req.url).pathname;
            var i = parseInt(path.slice(1), 10);
            var value = url.parse(req.url).query.split('=')[1];

            if (isNaN(i)) {
                res.statusCode = 400;
                res.end('Invalid item id');
            } else if (!items[i]) {
                res.statusCode = 404;
                res.end('Item not found');
            } else if (items[i] === value) {
                res.statusCode = 402;
                res.end('No revision')
            } else {
                items[i] = value;
                res.end('Success')
            }
            break;
        default:
            break;
    }
})

server.listen(3000, function() {
    console.log('Server start on 3000');
})