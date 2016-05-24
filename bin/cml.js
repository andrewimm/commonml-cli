#!/usr/bin/env node

'use strict';

const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

const PACKAGE_JSON = 'package.json';

cli(process.argv.slice(2)).then((code) => {
  process.exit(code);
}, (err) => {
  console.log('Uncaught error:', err);
});

function findDir() {
  let lastPath = '';
  let curPath = process.cwd();
  while (curPath !== lastPath) {
    if (isCommonMLDir(curPath)) {
      return curPath;
    }
    lastPath = curPath;
    curPath = path.resolve(curPath, '..');
  }
}

function isCommonMLDir(absPath) {
  const json = getPackageJSON(absPath);
  if (!json) {
    return false;
  }
  if (json.dependencies && json.dependencies.hasOwnProperty('CommonML')) {
    return true;
  }
  return false;
}

function getPackageJSON(absPath) {
  const jsonPath = path.join(absPath, PACKAGE_JSON);
  let stats;
  try {
    stats = fs.statSync(jsonPath);
  } catch (e) {
    return null;
  }
  if (!stats || !stats.isFile()) {
    return null;
  }
  try {
    let contents = require(jsonPath);
    return contents;
  } catch (e) {
    return null;
  }
}

function runCommand(cmd, dir) {
  return new Promise((resolve, reject) => {
    console.log('Running `' + cmd + '` at ' + dir + '\n');
    exec(cmd, {cwd: dir}, (err, stdout, stderr) => {
      if (err) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

function printHelp() {
  console.log('Usage: cml [action]\n');
  console.log('Actions:');
  console.log('  install - Install dependencies (runs `npm install` in the root dir)');
  console.log('  build   - Run the CommonML build script');
  console.log('  dir     - Print the directory in which actions will take place');
}

function cli(args) {
  return new Promise((resolve, reject) => {
    let dir;
    switch (args[0]) {
      case 'dir':
        dir = findDir();
        if (dir) {
          console.log('CommonML project located at: ' + dir);
          resolve(0);
        } else {
          console.log('No CommonML project found!');
          resolve(1);
        }
        break;
      case 'install':
        dir = findDir();
        if (dir) {
          runCommand('npm install', dir).then(() => {
            console.log('Done!');
            resolve(0);
          }, (err) => {
            console.log('An error occurred:');
            console.log(err);
            resolve(1);
          });
        } else {
          console.log('No CommonML project found!')
          resolve(1);
        }
        break;
      case 'build':
        dir = findDir();
        if (dir) {
          runCommand('node ./node_modules/CommonML/build.js', dir).then((out) => {
            console.log(out);
            resolve(0);
          }, (err) => {
            console.log('An error occurred:');
            console.log(err);
            resolve(1);
          });
        } else {
          console.log('No CommonML project found!')
          resolve(1);
        }
        break;
      default:
        if (args[0] !== '') {
          console.log('Unsupported method "' + (args[0] || '') + '"\n');
        }
        printHelp();
        resolve(1);
    }
  });
}