#!/usr/bin/env node

const { program } = require('commander');
const nodemon = require('nodemon');
const path = require('path');
const fsExtra = require('fs-extra');
const helpers = require('./helpers');

program
    .name('site-generator')
    .requiredOption('-i, --inputDir <inputDir>', 'Site directory with pages')
    .option(
        '-o, --outputDir <outputDir>',
        'Output directory with generated files',
        'dist'
    )
    .option('-s, --serve', 'Serve files in a server')
    .option('-p, --port <port>', 'Server port', 8080)
    .option('-m, --mode <mode>', 'Server port', 'production')
    .option(
        '-u, --publicPath <publicPath>',
        'PublicPath also the baseUrl from your site',
        '/'
    );

program.parse(process.argv);

const inputDir = path.resolve(program.inputDir);

if (program.serve) {
    const args = {
        siteDir: inputDir,
        port: program.port,
    };

    nodemon({
        script: path.resolve(__dirname, 'runServer.js'),
        watch: [program.inputDir],
        args: [JSON.stringify(args)],
        ext: 'jsx json js css',
    });

    nodemon
        .on('start', function () {
            console.log('App has started');
        })
        .on('quit', function () {
            console.log('App has quit');
            process.exit();
        })
        .on('restart', function (files) {
            console.log('App restarted due to: ', files);
        });
} else {
    const outputDir = path.resolve(program.outputDir);

    console.log(`Generating ${program.mode} site...`);

    helpers
        .getOutputStructure({
            env: program.mode,
            siteDir: inputDir,
            publicPath: program.publicPath,
        })
        .then((outputStructure) => {
            fsExtra.removeSync(outputDir);

            Object.keys(outputStructure).forEach((key) => {
                const outputFilePath = path.resolve(outputDir, key);
                const { content, encoding } = outputStructure[key];

                fsExtra.outputFileSync(
                    outputFilePath,
                    content,
                    encoding || 'utf8'
                );
            });
        })
        .then(() => {
            console.log('Site generated at', outputDir);
        })
        .catch((err) => {
            console.log(err);

            throw err;
        });
}
