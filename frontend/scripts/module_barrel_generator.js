/**
 * Module Barrel Generator (Script)
 * Version: 0.1
 * Author: Mohsin Shoaib
 * 
 * Description: 
 *      This script reads all direcotries (modules list) from src/modules directory and  generate index.ts 
 *      barrel in src/app directory.
 * 
 * How it works?
 * 1. Modules should be in src/modules direcotry i.e. base, layout etc.
 * 3. Run this script and it will generate (main) index.ts file in src/modules directory
 * 
 * NOTE: 
 *      This script will not detect if that directory has a cli/angular module or not. It will just create barrel by the name of available directories in moudles.
 * 
 * Purpose of this script:
 *  Generate main barrel, from where any module should be called/imported in your required module.
 * 
 * How to execute
 * 1. Run this command 'node scripts/module_barrel_generator.js'
 * 2. You can add it in package.json script i.e. "start": "node module_barrel_generator.js && ng serve"
 * 
 */

/**
 * To write host info in comments in output file.
 */
var os = require("os");
var path = require('path');

/**
 * For managing file reading and writing
 */
const fs = require('fs');

/**
 * Modules main directory, it is script input directory.
 */
const appModulesDir = './src/modules';

/**
 * File name and location you want to write.
 */
const output_file = "src/modules/index.ts";

/**
 * Read appModulesDir and return array of directoryies (ignore files)
 */
var modulesList = fs.readdirSync(appModulesDir).filter(file => fs.statSync(path.join(appModulesDir, file)).isDirectory())

/**
 * Out put text to write in file.
 * i.e. export * from './base/base.module'
 */
var output_text = "";

modulesList.forEach(function (moduleDir) {

    // Moudle name in upper camal case i.e. dashboard to Dashboard
    // moduleName_UC = moduleDir.charAt(0).toUpperCase() + moduleDir.slice(1);
    moduleName = moduleDir + ".module";

    output_text += "export * from \'./" + moduleDir + "/" + moduleName + "\';\n";

}, this);


/**
 * Prepare commonts/metadata for file.
 */
var date = new Date();
var file_meta = "/**";
file_meta += "\n * Generated From: " + os.hostname();
file_meta += "\n * Generated Date: " + date;
file_meta += "\n*/\n\n";

// Prepare output file text
var file_text = file_meta + output_text;

/**
 * 
 * Write compontents.ts file.
 * 
 */
fs.writeFile(
    output_file,
    file_text,
    function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(output_file + " file was saved/updated!");
    });