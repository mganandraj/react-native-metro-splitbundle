const path = require('path');

// import { reactNativeCliPath } from './paths';
const reactNativeCliPath = './node_modules/@react-native-community/cli';
const metroPath = path.dirname(require.resolve('metro/package.json', { paths: [reactNativeCliPath] }));

const bundleToString = require(`${metroPath}/src/lib/bundleToString`);
const baseJSBundle = require(`${metroPath}/src/DeltaBundler/Serializers/baseJSBundle`);

// Losely based off _getPrelude in metro.
// This will probably need to be updated to handle the bytecode case if we ever start shipping precompiled bytecode
// function getAppBundlePrelude(): object {
function getAppBundlePrelude() {
  const code =
    "if (this.__platformBundles !== undefined) { var platformBundles = this.__platformBundles.concat(); Reflect.deleteProperty(this, '__platformBundles'); for (var i = 0; i < platformBundles.length; ++i) { console.log('PB start ' + (i + 1) + '/' + platformBundles.length); eval(platformBundles[i]); console.log('PB done  ' + (i + 1) + '/' + platformBundles.length);  }}";
  const name = '__appbundleprelude__';

  return {
    dependencies: new Map(),
    getSource: () => Buffer.from(code),
    inverseDependencies: new Set(),
    path: name,
    output: [
      {
        type: 'js/script/virtual',
        data: {
          code,
          lineCount: require(path.resolve(metroPath, 'src/lib/countLines'))(code),
          map: []
        }
      }
      /*
      {
        type: 'bytecode/script/virtual',
        data: {
          bytecode: compile(code, {sourceURL: '__prelude__.virtual.js'})
            .bytecode,
        },
      },
      */
    ]
  };
}

// Remove the preModules from the output, since they will be part of the platform bundle
// (preModules includes things like metro's implementation of define and require used to define and load modules)
// Instead replace it with the platform bundle preloader, which is needed in web debug scenarios
// export function appBundleSerializer(entryPoint: string, _preModules: object[], graph: object, options: object): string {
exports.appBundleSerializer = function (entryPoint, _preModules, graph, options) {
  return bundleToString(baseJSBundle(entryPoint, [getAppBundlePrelude()], graph, options)).code;
}

// Remove the preModules from the output, since they will be part of the platform bundle
// (preModules includes things like metro's implementation of define and require used to define and load modules)
exports.noPreludeBundleSerializer = function (entryPoint, _preModules, graph, options) {
  return bundleToString(baseJSBundle(entryPoint, [], graph, options)).code;
}
