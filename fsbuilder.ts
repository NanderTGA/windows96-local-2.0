import fs from "fs";
import path from "path";

export enum fileType {
    file = 0,
    directory = 1
}

export type RofsJson = Record<string, {
    length: number,
    type: fileType,
}>;

let rofs: RofsJson;

export function processDir(dir: string): void {
    console.debug(`Processing ${dir}`);
    rofs[`/${dir}`] = {
        length: 0,
        type  : fileType.directory
    };

    const dirListing = fs.readdirSync(dir);
    dirListing.forEach(cFile => {
        const fileWithDir = path.posix.join(dir, cFile);
        if (fs.statSync(fileWithDir).isDirectory()) processDir(fileWithDir);
        else processFile(fileWithDir);
    });
}

export function processFile(file: string): void {
    console.debug(`Processing ${file}`);
    const fileLength = fs.statSync(file).size;
    rofs[`/${file}`] = {
        length: fileLength,
        type  : fileType.file
    };
}

export async function build(rootDir: string): Promise<RofsJson> {
    return new Promise( resolve => {
        rofs = { "/": { length: 0, type: fileType.directory } };
    
        processDir(path.normalize(rootDir));
        if (rootDir == ".") delete rofs["/."];
        resolve(rofs);
    });
}

export default async function BuildAndWrite(rootDir: string): Promise<void> {
    const rofs = await build(rootDir);

    return new Promise( (resolve, reject) => {
        console.debug(rofs);
        
        const writeStream = fs.createWriteStream(path.resolve(rootDir, "rofs.json"));
        writeStream.write(JSON.stringify(rofs));
        writeStream.end();

        writeStream.on("finish", () => resolve());

        writeStream.on("error", err => reject(err));
    });
}

if (require.main === module) BuildAndWrite(process.argv[2]).then(() => console.log("Done"));