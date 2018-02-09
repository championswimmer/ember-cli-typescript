'use strict';

const fs = require('fs');
const Command = require('ember-cli/lib/models/command'); // eslint-disable-line node/no-unpublished-require
const PRECOMPILE_MANIFEST = require('./precompile').PRECOMPILE_MANIFEST;

module.exports = Command.extend({
  name: 'ts:clean',
  works: 'insideProject',
  description: 'Cleans up compiled JS and declaration files generated by `ember ts:precompile`.',

  availableOptions: [{ name: 'manifest-path', type: String, default: PRECOMPILE_MANIFEST }],

  run(options) {
    let manifestPath = options.manifestPath;

    if (!fs.existsSync(manifestPath)) {
      this.ui.writeWarnLine(
        'No TS precompilation manifest found; you may need to clean up extraneous files yourself.'
      );
      return;
    }

    let files = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    for (let file of files) {
      if (fs.existsSync(file)) {
        if (file[file.length - 1] === '/') {
          fs.rmdirSync(file);
        } else {
          fs.unlinkSync(file);
        }
      }
    }
    fs.unlinkSync(manifestPath);
  },
});