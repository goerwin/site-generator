const http = require('http');
const path = require('path');
const { createFsFromVolume, Volume } = require('memfs');
const internalIp = require('internal-ip');

const ASSETS_EXT_REGEX = /\.(css|js|png|jpg|gif|svg)$/;
const CONTENT_TYPES = {
    html: 'text/html; charset=utf-8',
    css: 'text/css; charset=utf-8',
    js: 'text/javascript; charset=utf-8',
    png: 'image/png',
    jpg: 'image/jpg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
};

function runServer(memFsStructure, { port = 8080 }) {
    const memFs = createFsFromVolume(new Volume());
    const outputFilePath = '/';

    memFs.join = path.join;

    Object.keys(memFsStructure).forEach((key) => {
        const { content, encoding } = memFsStructure[key];
        const absFilePath = path.join(outputFilePath, key);

        memFs.mkdirSync(
            absFilePath
                .split('/')
                .slice(0, absFilePath.split('/').length - 1)
                .join('/'),
            { recursive: true }
        );

        memFs.writeFileSync(absFilePath, content, encoding || 'utf8');
    });

    http.createServer((req, res) => {
        const reqUrl = req.url;

        if (ASSETS_EXT_REGEX.test(reqUrl)) {
            const ext = reqUrl.match(ASSETS_EXT_REGEX)[1];

            res.writeHead(200, { 'Content-Type': CONTENT_TYPES[ext] });

            try {
                res.write(memFs.readFileSync(reqUrl));
                res.end();
            } catch (e) {
                res.writeHead(500);
                res.end();
            }

            return;
        }

        const content = ['.html', '/index.html'].reduce((prev, el) => {
            try {
                if (!prev) {
                    return memFs.readFileSync(reqUrl.replace(/\/$/, '') + el);
                }
            } catch (e) {}

            return prev;
        }, null);

        if (content) {
            res.writeHead(200, {
                'Content-Type': CONTENT_TYPES.html,
            });
            res.write(content);
            res.end();
        } else {
            res.writeHead(404);
            res.write('Not found');
            res.end();
        }
    }).listen(port, () => {
        const internalIPv4 = internalIp.v4.sync();
        console.log(`Listening in localhost:${port}`);
        console.log(`Listening in ${internalIPv4}:${port}`);
    });
}

module.exports = {
    runServer,
};
