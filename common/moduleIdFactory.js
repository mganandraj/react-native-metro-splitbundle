// @ts-check

'use strict';

// let sharedFileToIdMap: { [key: string]: number } = {};
let sharedFileToIdMap = {};

// ModuleIdFactory that starts at 1000 instead of 0, to avoid conflicting with platform bundle module idszzz
// export function createModuleIdFactory(existingManifestFilePath: string | undefined, defaultNextId: number): () => (path: string) => number {
exports.createModuleIdFactory = function (existingManifestFilePath, defaultNextId) {
  return () => {
    console.log('createModuleIdFactory');
    let nextId = defaultNextId;

    if (existingManifestFilePath) {
      sharedFileToIdMap = JSON.parse(
        require('fs')
          .readFileSync(existingManifestFilePath)
          .toString()
      );

      // nextId = Object.values(sharedFileToIdMap).reduce((curId: number, id: number) => (curId < id ? id : curId)) + 1;
      nextId = Object.values(sharedFileToIdMap).reduce((curId, id) => (curId < id ? id : curId)) + 1;
    }

    // return (path: string) => {
    return (path) => {
      let id = sharedFileToIdMap[path];
      if (typeof id !== 'number') {
        id = nextId++;
        sharedFileToIdMap[path] = id;
      }
      return id;
    };
  };
}

// export function createModuleFilterFromManifest(existingManifestFilePath: string): (module: { path: string }) => boolean {
exports.createModuleFilterFromManifest =  function (existingManifestFilePath) {
  const fileToIdMap = JSON.parse(
    require('fs')
      .readFileSync(existingManifestFilePath)
      .toString()
  );
  // return (module: { path: string }) => typeof fileToIdMap[module.path] !== 'number';
  return (module) => {
    return typeof fileToIdMap[module.path] !== 'number'
  };
}

// export function appBundleModuleIdFactory(): () => (path: string) => number {
exports.appBundleModuleIdFactory = function () {
  return createModuleIdFactory(undefined, 1000);
}

// export function getModuleIdManifest(): object {
exports.getModuleIdManifest = function () {
  return sharedFileToIdMap;
}
