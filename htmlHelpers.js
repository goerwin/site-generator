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

function getServerPageJSX(filepath, isTypescript) {
    return isTypescript
        ? `
        import React from 'react';
        import ReactDomServer from 'react-dom/server';
        import { Helmet } from 'react-helmet';
        import Page from '${filepath}';

        export default {
            html: ReactDomServer.renderToString(<Page />),
            // NOTE: https://github.com/nfl/react-helmet/issues/469
            helmet: Helmet.renderStatic(),
        };
        `
        : `
        const React = require('react');
        const ReactDomServer = require('react-dom/server');
        const { Helmet } = require('react-helmet');
        const Page = require('${filepath}');

        module.exports.default = {
            html: ReactDomServer.renderToString(<Page />),
            // NOTE: https://github.com/nfl/react-helmet/issues/469
            helmet: Helmet.renderStatic(),
        };`;
}

function getClientPageJSX(filepath, isTypescript) {
    return isTypescript
        ? `
        import React from 'react';
        import ReactDom from 'react-dom';
        import Page from '${filepath}';

        ReactDom.hydrate(
            <Page />,
            document.getElementById('app')
        );
        `
        : `
        const React = require('react');
        const ReactDom = require('react-dom');
        const Page = require('${filepath}');

        ReactDom.hydrate(
            <Page />,
            document.getElementById('app')
        );`;
}

module.exports = {
    getMainHtml,
    getServerPageJSX,
    getClientPageJSX,
};
