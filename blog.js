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
                if (filename.match('.md')) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    fs.readFile(filename, 'utf-8', (err, data) => {
                        res.write('<div class="card">');
                        res.write(marked(data));
                        res.write('</div><div class="inter"></div>');
                        res.end();
                    });
                }
                else if (filename.match('.png')) {
                    res.writeHead(200, {'Content-Type': 'image/png'});
                    fs.readFile(filename, (err, data) => {
                        res.write(data);
                        res.end();
                    });
                }
                else {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    fs.readFile(filename, 'utf-8', (err, data) => {
                        res.write(data);
                        res.end();
                    });
                }
            }
        });
    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<head><meta charset="UTF-8"><title>Blog Exemple</title></head>');
        fs.readFile('style.css', 'utf-8', (err, data) => {
            if (err) { return res.end(err); }
            res.write('<style>');
            res.write(data);
            res.write('</style>');

        fs.readFile('script.js', 'utf-8', (err, data) => {
	    if (err) { return res.end(err); }
            res.write('<script>');
            res.write(tag ? 'var tag="' + tag + '";' : 'var tag;');
            res.write(title ? 'var title="' + title + '";' : 'var title;');
            res.write(data);
            res.write('</script>');
            res.end();
        });});
    }
}).listen(8080);
