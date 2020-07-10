const helpers = require('./helpers');
const serverHelpers = require('./serverHelpers');

const {
    siteDir,
    port,
    isTypescript,
    env = 'development',
    publicPath = '/',
} = JSON.parse(process.argv[2]);

helpers
    .getOutputStructure({ env, siteDir, publicPath, isTypescript })
    .then((outputStructure) => {
        serverHelpers.runServer(outputStructure, { port });
    })
    .catch((err) => {
        console.log(err);

        throw err;
    });
