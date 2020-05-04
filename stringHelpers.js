function getGitIgnore() {
    return ['node_modules', 'dist'].join('\n');
}

function getPackageJson(name) {
    return `
      {
        "name": "${name}",
        "version": "1.0.0",
        "description": "my site",
        "scripts": {
          "build": "site-generator build",
          "build-dev": "site-generator build -e development",
          "dev": "site-generator dev",
          "prod": "site-generator dev -e production",
          "test": "echo \\"Error: no test specified\\" && exit 1"
        },
        "keywords": [],
        "author": "",
        "license": "ISC"
      }
    `;
}

module.exports = {
    getPackageJson,
    getGitIgnore,
};
