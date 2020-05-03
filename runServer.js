const helpers = require('./helpers');
const serverHelpers = require('./serverHelpers');

const { siteDir, port } = JSON.parse(process.argv[2]);

helpers
    .getOutputStructure({
        env: 'development',
        siteDir,
        publicPath: '/',
    })
    .then((outputStructure) => {
        serverHelpers.runServer(outputStructure, { port });
    })
    .catch((err) => {
        console.log(err);

        throw err;
    });
