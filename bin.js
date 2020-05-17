#!/usr/bin/env node

const { program } = require('commander');
const nodemon = require('nodemon');
const path = require('path');
const fsExtra = require('fs-extra');
const helpers = require('./helpers');
const stringHelpers = require('./stringHelpers');
const shellHelpers = require('helpers/dist/server/shell');
const inputDirOption = ['-i, --inputDir <inputDir>', 'inputDir', 'src'];
const outputDirOption = ['-o, --outputDir <outputDir>', 'outputDir', 'dist'];
const portOption = ['-p, --port <port>', 'Server port', 8080];
const publicPathOption = [
    '-u, --publicPath <publicPath>',
    'PublicPath AKA the baseUrl from your site',
    '/',
];
const envOption = [
    '-e, --env <env>',
    'development or production',
    'development',
];

program.name('site-generator');

program
    .command('dev')
    .description('Starts development server')
    .option(...inputDirOption)
    .option(...portOption)
    .option(...envOption)
    .action(({ inputDir, port, env }) => {
        const siteDir = path.resolve(inputDir);
        const args = { siteDir, port, env };

        nodemon({
            script: path.resolve(__dirname, 'runServer.js'),
            watch: [siteDir],
            args: [JSON.stringify(args)],
            ext: 'tsx json ts css',
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
    });

program
    .command('build')
    .description('Builds the site and generate the assets')
    .option(...inputDirOption)
    .option(...outputDirOption)
    .option(...publicPathOption)
    .option(envOption[0], envOption[1], 'production')
    .action(({ inputDir, outputDir, env, publicPath }) => {
        outputDir = path.resolve(outputDir);
        const siteDir = path.resolve(inputDir);

        console.log(`Generating ${env} site...`);

        helpers
            .getOutputStructure({
                env,
                siteDir,
                publicPath,
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
    });

program
    .command('new <siteName>')
    .description('creates a new site')
    .action((siteName) => {
        const cwd = path.resolve(process.cwd());
        const siteFolder = path.resolve(cwd, siteName);
        const packagesToInstall = [
            'react',
            'react-dom',
            'react-helmet',
            'prop-types',
            'https://github.com/goerwin/site-generator',
        ];

        if (fsExtra.existsSync(siteFolder)) {
            console.log('This folder already exists!', siteFolder);
            return;
        }

        process.stdout.write(`Creating your site "${siteName}"...\n`);

        fsExtra.removeSync(siteFolder);
        fsExtra.mkdirSync(siteFolder, { recursive: true });

        fsExtra.outputFileSync(
            path.resolve(siteFolder, '.gitignore'),
            stringHelpers.getGitIgnore()
        );
        fsExtra.outputFileSync(
            path.resolve(siteFolder, 'package.json'),
            stringHelpers.getPackageJson(siteName)
        );

        shellHelpers.spawnCommand('npm', siteFolder, [
            'install',
            '--save',
            ...packagesToInstall,
        ])
            // execPromise(`npm install --save ${packagesToInstall.join(' ')}`, {
            //     cwd: siteFolder,
            // })
            .then(() => {
                fsExtra.copySync(
                    path.resolve(__dirname, 'siteSamples/templateSite'),
                    path.resolve(siteFolder, 'src')
                );
            })
            .then(() => {
                console.log('========================================\n');
                console.log('Now you probably want to:\n');
                console.log('$ cd', siteName);
                console.log('$ npm run dev');
            })
            .catch((err) => {
                fsExtra.removeSync(siteFolder);
                console.log(err);

                throw err;
            });
    });

program.parse(process.argv);
