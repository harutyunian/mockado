import fs from 'fs';
import path from 'path';
import clc from 'cli-color';
import {mockadoEmoji} from '../constant';
import {validate} from './fileValidate';

type Mapping = [string, Record<string, any>];

function readDirectory(dirPath: string, jsonDataArray: Mapping[]) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            readDirectory(filePath, jsonDataArray);
        } else {
            const ext = path.extname(file).toLowerCase();

            if (!['.json', '.js', '.ts'].includes(ext)) {
                console.warn(
                    clc.yellow(`${mockadoEmoji} Warning:`) +
                    clc.red(` Unsupported file type "${file}". Only .json, .js, and .ts are supported.`)
                );
                return;
            }

            if (ext !== '.json') return;

            try {
                const data = fs.readFileSync(filePath, 'utf8').trim();

                if (data === '') {
                    console.warn(
                        clc.yellow(`${mockadoEmoji} Warning:`) +
                        clc.red(` "${file}" is empty. Skipping.`)
                    );
                    return;
                }

                const jsonData = JSON.parse(data);
                jsonDataArray.push([file, jsonData]); // Add to result array
            } catch (parseErr) {
                console.error(clc.red(`${mockadoEmoji} Error parsing JSON in "${file}":`), parseErr);
            }
        }
    });
}

export function getMappings(dir: string = 'mapping'): Mapping[] {
    const absoluteDirPath = path.join(__dirname, '../', dir);
    console.log(clc.green(`${mockadoEmoji} Parsing JSON...`));

    if (!fs.existsSync(absoluteDirPath)) {
        console.error(clc.red(`${mockadoEmoji} Directory does not exist: ${absoluteDirPath}`));
        return [];
    }

    const jsonDataArray: Mapping[] = [];
    readDirectory(absoluteDirPath, jsonDataArray);

    validate(jsonDataArray);

    return jsonDataArray;
}