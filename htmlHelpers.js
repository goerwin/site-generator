const htmlMinifier = require('html-minifier');

function getMainHtml(stringifiedReactApp, helmet, attrs = {}) {
    const html = `
      <!doctype html>
      <html ${helmet.htmlAttributes.toString()}>
          <head>
              ${helmet.title.toString()}
              ${helmet.meta.toString()}
              ${helmet.link.toString()}
              ${helmet.style.toString()}
              ${helmet.script.toString()}
              ${(attrs.links || []).join('\n')}
              ${(attrs.headScripts || []).join('\n')}
          </head>
          <body ${helmet.bodyAttributes.toString()}>
              <div id="app">${stringifiedReactApp}</div>
              ${(attrs.bottomScripts || []).join('\n')}
          </body>
      </html>
  `;

    return htmlMinifier.minify(html, {
        collapseWhitespace: true,
    });
}

function getServerPageJSX(filepath) {
    return `
        const React = require('react');
        const ReactDomServer = require('react-dom/server');
        const { Helmet } = require('react-helmet');
        const Page = require('${filepath}');

        module.exports = {
            html: ReactDomServer.renderToString(<Page />),
            // NOTE: https://github.com/nfl/react-helmet/issues/469
            helmet: Helmet.renderStatic(),
        };
    `;
}

function getClientPageJSX(filepath) {
    return `
        const React = require('react');
        const ReactDom = require('react-dom');
        const Page = require('${filepath}');

        ReactDom.hydrate(
            <Page />,
            document.getElementById('app')
        );
    `;
}

module.exports = {
    getMainHtml,
    getServerPageJSX,
    getClientPageJSX,
};
