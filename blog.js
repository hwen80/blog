const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const marked = require('marked');

http.createServer((req, res) => {
    var q = url.parse(req.url, true);
    var pathname = q.pathname.replace(/^\/blog/g, '');

    var query = querystring.parse(req.url.split('?').pop());
    var tag = query.tag;
    var title = query.title;

    if (pathname.match('^/articles/') || pathname.match('^/img/')) {
        var filename = '.' + pathname;
        fs.access(filename, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end('404 File Not Found\n');
            }
            else {
                if (filename.match('.json')) {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    fs.createReadStream(filename, 'utf-8').pipe(res);
                }
                else if (filename.match('.png')) {
                    res.writeHead(200, {'Content-Type': 'image/png'});
                    fs.createReadStream(filename).pipe(res);
                }
                else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write('<div class="card">');
                    const read = fs.createReadStream(filename, 'utf-8');
                    var markdown = "";
                    read.on('data', function (data) {
                        markdown += data;
                    });
                    read.on('end', function() {
                        res.write(marked(markdown));
                        res.end('</div><div class="inter"></div>');
                    });
                }
            }
        });
    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<head><meta charset="UTF-8"><title>Blog d\'Ernest</title></head>');
        res.write('<style>');
        const style = fs.createReadStream('style.css', 'utf-8');
        style.on('data', (data) => { res.write(data); })
             .on('end', () => {
                res.write('</style><script>');
                res.write(tag ? 'var tag="' + tag + '";' : 'var tag;');
                res.write(title ? 'var title="' + title + '";' : 'var title;');
                const script = fs.createReadStream('script.js', 'utf-8');
                script.on('data', (data) => { res.write(data); })
                      .on('end', () => { res.end('</script>'); });
        });
    }
}).listen(8080);
