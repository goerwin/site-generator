const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const webpackConfigs = require('./webpackConfigs');
const stringHelpers = require('helpers/dist/universal/string');
const { createFsFromVolume, Volume } = require('memfs');
const requireFromString = require('require-from-string');
const fsExtra = require('fs-extra');
const htmlHelpers = require('./htmlHelpers');

function isAJsFile(filepath) {
    return /\.js$/.test(filepath);
}

function isACssFile(filepath) {
    return /\.css$/.test(filepath);
}

function getWebpackStats(webpackConfig, options = {}) {
    const outputMemFs = createFsFromVolume(new Volume());
    outputMemFs.join = path.join;

    const webpackCompiler = webpack(webpackConfig);

    if (options.inputFileSystem) {
        webpackCompiler.inputFileSystem = options.inputFileSystem;
    }

    webpackCompiler.outputFileSystem = outputMemFs;

    return new Promise((resolve, reject) => {
        webpackCompiler.run((err, stats) => {
            if (err) {
                reject(err);

                return;
            }

            if (stats.compilation.errors && stats.compilation.errors.length) {
                reject(stats.compilation.errors);

                return;
            }

            resolve(stats);
        });
    });
}

function getOutputStructure({ publicPath, env = 'production', siteDir }) {
    const tempSiteDir = path.resolve(__dirname, '.cache/site');
    const mappedEntriesWithPages = {};
    const outputStructure = {};
    const fileExtPrefixRegex = /\.tsx?$/;
    const fileExtPrefix = '.tsx';

    return Promise.resolve()
        .then(() => {
            fsExtra.removeSync(tempSiteDir);
            fsExtra.copySync(siteDir, tempSiteDir);

            const pages = glob.sync(`**/*${fileExtPrefix}`, {
                cwd: path.resolve(tempSiteDir, 'pages'),
            });

            const clientEntries = {};
            const serverEntries = {};

            pages.forEach((page) => {
                const parsedPage = stringHelpers.slugify(
                    page.replace(fileExtPrefixRegex, '')
                );
                const pageJSXFilepath = `./pages/${page.replace(
                    fileExtPrefixRegex,
                    ''
                )}`;
                const clientFilename = path.resolve(
                    tempSiteDir,
                    parsedPage + 'Client.jsx'
                );
                const serverFilename = path.resolve(
                    tempSiteDir,
                    parsedPage + 'Ssr.jsx'
                );

                clientEntries[parsedPage] = clientFilename;
                serverEntries[parsedPage] = serverFilename;
                mappedEntriesWithPages[parsedPage] = page;

                fsExtra.outputFileSync(
                    clientFilename,
                    htmlHelpers.getClientPageJSX(pageJSXFilepath)
                );
                fsExtra.outputFileSync(
                    serverFilename,
                    htmlHelpers.getServerPageJSX(pageJSXFilepath)
                );
            });

            return webpackConfigs({
                env,
                publicPath,
                clientEntries,
                serverEntries,
            });
        })
        .then(({ clientConfig, serverConfig }) => {
            return Promise.all([getWebpackStats(clientConfig), serverConfig]);
        })
        .then(([clientStats, serverConfig]) => {
            const compilationAssets = clientStats.compilation.assets;

            Object.keys(compilationAssets).forEach((key) => {
                outputStructure[key] = {
                    content: compilationAssets[key].source(),
                };
            });

            return { clientStats, serverConfig };
        })
        .then(({ clientStats, serverConfig }) => {
            const statsJson = clientStats.toJson();
            const entrypoints = statsJson.entrypoints;
            const assetsByPage = {};

            Object.keys(entrypoints).forEach((entrypoint) => {
                const assets = entrypoints[entrypoint].assets;
                const bottomScripts = [];
                const links = [];

                assets.forEach((asset) => {
                    const href = path
                        .join(publicPath, asset)
                        .replace(':/', '://');

                    if (isAJsFile(href)) {
                        bottomScripts.push(`<script src="${href}"></script>`);
                    } else if (isACssFile(href)) {
                        links.push(
                            `<link rel="stylesheet" href="${href}" type="text/css">`
                        );
                    }
                });

                assetsByPage[entrypoint] = { bottomScripts, links };
            });

            return { assetsByPage, serverConfig };
        })
        .then(({ assetsByPage, serverConfig }) => {
            return getWebpackStats(serverConfig).then((stats) => {
                const compilationAssets = stats.compilation.assets;

                Object.keys(assetsByPage).forEach((page) => {
                    const pageAssets = assetsByPage[page];

                    const ssr = requireFromString(
                        compilationAssets[page + '.bundle.js'].source()
                    );

                    const outputPagepath = mappedEntriesWithPages[page].replace(
                        fileExtPrefixRegex,
                        '.html'
                    );

                    outputStructure[outputPagepath] = {
                        encoding: 'utf8',
                        content: htmlHelpers.getMainHtml(ssr.html, ssr.helmet, {
                            links: pageAssets.links,
                            bottomScripts: pageAssets.bottomScripts,
                        }),
                    };
                });

                return outputStructure;
            });
        })
        .finally(() => {
            fsExtra.removeSync(tempSiteDir);
        });
}

module.exports = {
    getOutputStructure,
};
