"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nfs = require("fs");
const lstatPromise = (filePath) => {
    return new Promise((resolve, reject) => {
        nfs.lstat(filePath, function (err, stat) {
            if (err)
                return reject(err);
            else
                return resolve(stat);
        });
    });
}, readdirPromise = (folder) => {
    return new Promise((resolve, reject) => {
        nfs.readdir(folder, function (err, files) {
            if (err)
                return reject(err);
            else
                return resolve(files);
        });
    });
}, readFilePromise = (fileName) => {
    return new Promise((resolve, reject) => {
        nfs.readFile(fileName, function (err, data) {
            if (err)
                return reject(err);
            else
                return resolve(data);
        });
    });
}, writeFilePromise = (fileName, data) => {
    return new Promise((resolve, reject) => {
        nfs.writeFile(fileName, data, function (err) {
            if (err)
                return reject(err);
            else
                return resolve(data);
        });
    });
};
exports.fs = {
    lstat: lstatPromise,
    readdir: readdirPromise,
    readFile: readFilePromise,
    writeFile: writeFilePromise
};
