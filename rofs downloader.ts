import { DownloaderHelper } from "node-downloader-helper";
import fs from "fs";
import { RofsJson, fileType } from "./fsbuilder";
import path from "path";

export async function downloadRofsFile(outDir = __dirname, w96Domain = "https://windows96.net", rofsLocation = "/system/images/rofs.json") {
    const rofsPath = path.resolve(outDir, "rofs.json");
    if (fs.existsSync(rofsPath)) fs.rmSync(rofsPath);

    const url = `${w96Domain}${rofsLocation}`;
    return await downloadFile(url, outDir);
}

export async function downloadFile(file: string, outDir = __dirname): Promise<boolean> {
    return new Promise( (resolve, reject) => {
        const downloader = new DownloaderHelper(file, outDir);

        downloader.on("end", () => {
            console.log(`Download of file ${file} completed`);
            resolve(true);
        });

        downloader.on("error", err => {
            console.error(`Download of file ${file} failed`, err);
            resolve(false);
        });
    
        downloader.start().catch( err => {
            console.error(`Download of file ${file} failed`, err);
            resolve(false);
        });
    });
}

export async function readRofs(rofsFile = "./rofs.json"): Promise<RofsJson> {
    return new Promise( (resolve, reject) => {
        let rofsString = "";
        const rofsReadStream = fs.createReadStream(rofsFile);
        rofsReadStream.setEncoding("utf8");
        
        rofsReadStream.on("data", data => rofsString += data);
        rofsReadStream.on("end", () => {
            const rofs = JSON.parse(rofsString);
            
            rofs["/system/images"] = { length: 0, type: fileType.directory };
            rofs["/system/images/rootfs"] = { length: 0, type: fileType.directory };

            [
                "rofs.json",
                "mobsupport-ios.zip",
                "mobsupport-generic.zip",
                "mobsupport.zip",
                "bstr.json",
                "recovery.zip",
                "rootfs.zip",
                "rootfs/recovery.zip",
                "rootfs/oobe.zip",
                "rootfs/rootfs.zip"
            ].forEach( file => {
                rofs[`/system/images/${file}`] = { length: 0, type: fileType.file };
            });

            rofs["/vc"] = { length: 0, type: fileType.directory };
            rofs["/vc/ct.js"] = { length: 0, type: fileType.file };
            
            resolve(rofs);
        });
        rofsReadStream.on("error", err => reject(err) );
    });
}

export async function createDirectories(rofs: RofsJson, outDir = __dirname): Promise<void> {
    for (const fileOrDir in rofs) {
        if (rofs[fileOrDir].type == fileType.directory) {
            const dir = path.join(outDir, fileOrDir);
            if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) fs.mkdirSync(dir);
        }
    }
}

export async function downloadFiles(rofs: RofsJson, outDir = __dirname, w96Domain = "https://windows96.net"): Promise<void> {
    for (const fileOrDir in rofs) {
        if (rofs[fileOrDir].type == fileType.file) {
            const url = `${w96Domain}${fileOrDir}`;
            const fileDir = path.join(outDir, path.dirname(fileOrDir));
            await downloadFile(url, fileDir);
        }
    }
}

export async function downloadRofsContents(outDir = __dirname, w96Domain = "https://windows96.net", rofsFile = "./rofs.json"): Promise<void> {
    const rofs = await readRofs(rofsFile);

    await createDirectories(rofs, outDir);
    await downloadFiles(rofs, outDir, w96Domain);
}

export default async function iniateDownload(outDir = __dirname, w96Domain = "https://windows96.net"): Promise<void> {
    if (!await downloadRofsFile(outDir, w96Domain)) throw new Error("Failed to download rofs.json");
    console.log("rofs.json downloaded successfully");

    return await downloadRofsContents(outDir, w96Domain);
}

if (require.main === module) iniateDownload(__dirname, process.argv[2]).then(() => console.log("Done"));