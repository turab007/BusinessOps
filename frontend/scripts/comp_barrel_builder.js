/**
 * Component Barrel Builder (Script)
 * Version: 0.1
 * Author: Mohsin Shoaib
 * 
 * Description: 
 *      This script reads all direcotries (modules list) from src/app/app-modules directory and  generate components.ts 
 * file in src/app directory.
 * 
 * How it works?
 * 1. Modules should be in src/app/app-modules direcotry i.e. base, layout etc.
 * 2. Each module should have components.ts file.
 * 3. That component.ts file should export two const COMPONENTS AND PROVIDERS by following this rule:
 *      {module (directory) name in uppercase}_COMPONENTS
 *      {module (directory) name in uppercase}_PROVIDERS
 *      NOTE: This script will not detect if components.ts file exsits or not or even what is in it.
 * 4. Run this script and it will generate (main) components.ts file in src/app directory which is actually being included in app.moudle.ts
 * 
 * Purpose of this script:
 *  Avoid inserting manual code in app.module.ts file as much as possible.
 * 
 * Also you can add it in package.json script i.e. "start": "node comp_barrel_builder.js && ng serve",
 * 
 */

/**
 * To write host info in comments in output file.
 */
var os = require("os");

/**
 * For managing file reading and writing
 */
const fs = require('fs');

/**
 * Modules main directory, it is script input directory.
 */
const appModulesDir_path = './src/app/';

/**
 * App modules directory name
 */
const appModulesDir = 'app-modules';

/**
 * Components postfix which is being exported from appModulesDir/components.ts file
 * "i.e. LAYOUT_COMPONENTS, BASE_COMPONENTS" here '_COMPONENTS' is the postfix
 */
const components_postfix = "_COMPONENTS";

/**
 * Providers postfix which is being exported from appModulesDir/components.ts file
 * "i.e. LAYOUT_PROVIDERS, BASE_PROVIDERS" here '_PROVIDERS' is the postfix
 */
const providers_postfix = "_PROVIDERS";

/**
 * File name and location you want to write.
 */
const output_file = "src/app/components.ts";

/**
 * 
 * Read appModulesDir and prepare following
 * 1. imports
 * 2. exports components
 * 3. exports providers
 * 
 * and write file 'i.e. app/components.ts'
 * 
 */
fs.readdir(appModulesDir_path + appModulesDir, (err, moduleDirectories) => {

    var counter = 0;

    // Following strings will be prepared and written in output file.
    var import_string = "";
    var app_component_string = "";
    var app_provider_ary = "";

    // To manage components and providers (array) exports in output file
    var app_component_ary = [];
    var app_provider_ary = [];

    // Read modules/input directory and prepare import string and collect components and providers items in array.
    moduleDirectories.forEach(moduleDir => {

        // Moudle name in upper case
        moduleName_UC = moduleDir.toUpperCase();

        import_string += "import { " + moduleName_UC + components_postfix + ", " + moduleName_UC + providers_postfix + " } ";
        import_string += " from \'./" + appModulesDir + "/" + moduleDir + "/components\';\n";

        app_component_ary[counter] = moduleName_UC + components_postfix;
        app_provider_ary[counter] = moduleName_UC + providers_postfix;

        counter++;
    });

    // Prepare components export text
    if (app_component_ary.length > 0) {
        var c = 1;
        app_component_string = "export const APP_COMPONENTS = [";

        app_component_ary.forEach(app_component => {
            app_component_string += "\n\t" + app_component + ((c < app_component_ary.length) ? ", " : "");
            c++;
        });

        app_component_string += "\n];";
    }

    // Prepare providers export text
    if (app_provider_ary.length > 0) {

        var c = 1;

        app_provider_string = "export const APP_PROVIDERS = [";

        app_provider_ary.forEach(app_provider => {
            app_provider_string += "\n\t" + app_provider + ((c < app_component_ary.length) ? ", " : "");
            c++;
        });

        app_provider_string += "\n];";
    }

    

    var date = new Date();
    var file_meta = "/**";
    file_meta += "\n * Generated From: " + os.hostname();
    file_meta += "\n * Generated Date: " + date;
    file_meta += "\n*/\n\n";

    // Prepare output file text
    var file_text = file_meta + import_string + "\n" + app_component_string + "\n" + app_provider_string;

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
            console.log(output_file + " file was saved!");
        });


});

