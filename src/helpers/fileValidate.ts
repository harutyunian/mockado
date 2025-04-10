import clc from 'cli-color';
import { mockadoEmoji } from "../constant";


// This will validate file content
// and if something wrong it will be written on console

export function validate(jsonData: [string, any][]): [string, any][] {
    const validatedJsonList = jsonData.filter(([fileName, json])=>{
        const { url, method } = json?.request || {};
        const {status} = json?.response || {};

        if (!url) {
            console.log(clc.red(`${mockadoEmoji} Warning: Skipping file ${fileName} due to missing "url".`));
            return false;
        }else  if (!method) {
            const statusMsg = status ? "" : " and missing status, defaulting to 200";
            console.log(clc.yellow(`${mockadoEmoji} Warning: Missing HTTP method in ${fileName}. Defaulting to GET${statusMsg}.`));
        }
        return true
    })
    if(!validatedJsonList.length){
        console.log(clc.redBright(`No any json file validated`));

        return []
    }
    validatedJsonList.forEach(([_, json])=>{
        console.log(clc.greenBright(`${mockadoEmoji} Mock endpoint ${json.request.url} ready for test ==>`));

    })
    return validatedJsonList;
}
