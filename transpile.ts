import fs from "fs";
import path from "path";
import { transformFileAsync } from "@babel/core";
import { rollup } from "rollup";
import JSZip from "jszip";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export async function removeRequires(file: string): Promise<boolean> {
    const bundle = await rollup({
        input  : file,
        plugins: [
            nodeResolve({
                browser: true
            }),
            commonjs()
        ]
    });
    console.log("bundle: ", bundle);
    
    console.log("bundle.write(): ", await bundle.write({
        format: "iife",
        file
    }));
}

export async function transpileFile(file: string): Promise<void> {
    await transformFileAsync(file, {
        presets: [
            [
                "@babel/preset-env", {
                    corejs: {
                        "version": 3
                    },
                    useBuiltIns: "usage",
                    targets    : {
                        "ie": "11"
                    }
                }
            ]
        ]
    }).then( result => {
        if (!result) return console.error(`Error transpiling ${file}`);
        fs.writeFileSync(file, result.code);
        removeRequires(file);

        console.log(`Transpiled ${file}`);
    }).catch( err => console.debug(`Failed to transpile ${file}`));
}

export async function transpileDir(dir: string) {
    const files = fs.readdirSync(dir);
    files.forEach( async file => {
        const fileWithDir = path.resolve(dir, file);
        if (fs.statSync(fileWithDir).isDirectory()) transpileDir(fileWithDir);
        else switch (path.extname(fileWithDir)) {
            case ".js":
                transpileFile(fileWithDir);
                break;
            case ".zip": {
                break; // not iomplentmented yet
                //notimpaelern
                // extract the zip file, and make sure it doesn't overwrite anything
                const zip = new JSZip();


                break;
            }
            default:
                break;
        }
    });
}

export default async function transpileAll() {
    return Promise.all([
        "data",
        "dl",
        "system"
    ].map( async dir => transpileDir(dir) ));
}

if (require.main === module) /*transpileAll();*/ transpileFile("fak.js");