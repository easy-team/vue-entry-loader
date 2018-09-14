'use strict';
const path = require('path');
const loaderUtils = require('loader-utils');
const node = require('./lib/node');
const web = require('./lib/web');
module.exports = function(source) {
  this.cacheable();
  const options = loaderUtils.getOptions(this) || {};
  const config = { codeSegment: '' };
  if (options.templateFile) {
    config.codeSegment = `import codeSegment from '${options.templateFile}'
    codeSegment(Vue);`;
  }
  const loader = this.target === 'node' ? node : web;
  const content = loader(this, source, options, config);
  return content;
};
