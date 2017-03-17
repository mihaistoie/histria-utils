import * as nfs from 'fs';

const
    lstatPromise = (filePath: string): Promise<nfs.Stats> => {
        return new Promise<nfs.Stats>((resolve, reject) => {
            nfs.lstat(filePath, function (err, stat) {
                if (err)
                    return reject(err);
                else
                    return resolve(stat);
            });

        });
    },
    readdirPromise = (folder: string): Promise<string[]> => {
        return new Promise<string[]>((resolve, reject) => {
            nfs.readdir(folder, function (err, files) {
                if (err)
                    return reject(err);
                else
                    return resolve(files);
            });

        });
    },
    readFilePromise = (fileName: string): Promise<Buffer> => {
        return new Promise<Buffer>((resolve, reject) => {
            nfs.readFile(fileName, function (err, data) {
                if (err)
                    return reject(err);
                else
                    return resolve(data);
            });

        });
    },
    writeFilePromise = (fileName: string, data: any): Promise<void> => {
        return new Promise<any>((resolve, reject) => {
            nfs.writeFile(fileName, data, function (err) {
                if (err)
                    return reject(err);
                else
                    return resolve(data);
            });

        });
    }

export const fs = {
    lstat: lstatPromise,
    readdir: readdirPromise,
    readFile: readFilePromise,
    writeFile: writeFilePromise
}


