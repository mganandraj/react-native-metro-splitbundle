let moduleIdFactory = require('../common/moduleIdFactory');
let noPreludeBundleSerializer = require('../common/moduleIdFactory');
const path = require('path')

module.exports = {
  // WatchFolders is only needed due to the yarn workspace layout of node_modules, we need to watch the symlinked locations separately
  watchFolders: [
    // Include hoisted modules
    path.resolve(__dirname, '../node_modules'),
    //path.resolve(__dirname, '../mixin-api')
  ],
    serializer: {
      createModuleIdFactory: moduleIdFactory.createModuleIdFactory(undefined, 0)
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false
        }
      })
    }
  };
  