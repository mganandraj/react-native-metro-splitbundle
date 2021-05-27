// @ts-check

const path = require('path');
const fs = require('fs');

// const { reactNativeCliPath } = require('./node_modules/@react-native-community/cli');
const reactNativeCliPath = '../node_modules/@react-native-community/cli';
const cmdLineArgs = require(path.resolve(reactNativeCliPath, 'build/commands/bundle/bundleCommandLineArgs')).default;

let moduleIdFactory = require('../common/moduleIdFactory');

async function manifestBundle(_, config, args, output) {
  console.log('building manifest bundle.');
  const bundle = require(path.resolve(reactNativeCliPath, 'build/commands/bundle/bundle')).default.func;
  await bundle(_, config, args, output);
  // save bundle

  const manifest = moduleIdFactory.getModuleIdManifest();

  fs.writeFileSync(args.outputManifest, JSON.stringify(manifest, null, 2));
}

module.exports = {
  // **** This section defines a modified bundle command we need to produce platform bundles
  commands: [
    {
      name: 'manifest-bundle',
      description: 'Creates a bundle using an existing module manifest, and saves a manifest of the created bundle.',
      func: manifestBundle,
      options: [
        ...cmdLineArgs,
        {
          name: '--output-manifest <path>',
          description: 'Location to save module id manifest of the built bundle'
        }
      ]
    }
  ],
  serializer: {
    createModuleIdFactory: moduleIdFactory.createModuleIdFactory(undefined, 0)
  }
};
