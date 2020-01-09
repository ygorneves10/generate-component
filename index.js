const fs = require('fs');
const inquirer = require('inquirer');
const path = "generateComponent/defaults/"
let fileContentImport = fs.readFileSync(path + "componentImport.js", 'utf8');
let fileContent = fs.readFileSync(path + "component.js", 'utf8');
let newFilePath = "react/"

toCapitalize = str => {
    str = str.split(" ");

    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ").replace(new RegExp(" ", 'g'), "");
}

declareInterfaces = componentName => {
    const interfacesFile = "store/interfaces.json"
    const interfaces = fs.readFileSync(interfacesFile);
    const newObject = {}
    const newComponentName = componentName.split(/(?=[A-Z])/).join("-").toLowerCase()

    newObject[newComponentName] = {
        component: componentName
    }

    const newInterfacesContent = {
        ...JSON.parse(interfaces),
        ...newObject
    }

    fs.writeFile(interfacesFile, JSON.stringify(newInterfacesContent, null, 4), (err) => {
        if (err) throw err;
        console.log("File Updated: ", interfacesFile)
    })
}

inquirer
    .prompt([
        {
            name: 'componentName',
            message: 'Component name: ',
        },
        {
            type: 'rawlist',
            name: 'scssFile',
            message: 'Create a CSS file?',
            choices: ['Yes', 'No'],
        },
        {
            type: 'rawlist',
            name: 'declare',
            message: 'Declare component in interfaces.json file?',
            choices: ['Yes', 'No'],
        }
    ])
    .then(answers => {
        let { componentName, scssFile, declare } = answers

        componentName = toCapitalize(componentName)

        let newFileName = newFilePath + componentName + ".js";

        fileContentImport = fileContentImport.replace(new RegExp("NewComponent", 'g'), componentName)
        fileContent = fileContent.replace(new RegExp("NewComponent", 'g'), componentName)

        fs.writeFile(newFileName, fileContentImport, (err) => {
            if (err) throw err;

            console.log("Created file: ", newFileName);

            newFilePath = newFilePath + "components/" + componentName

            fs.mkdirSync(newFilePath)

            newFileName = newFilePath + "/index.js";

            fs.writeFile(newFileName, fileContent, (err) => {
                if (err) throw err;

                console.log("Created file: ", newFileName);

                if (declare == "Yes") {
                    declareInterfaces(componentName)
                }

                if (scssFile == "Yes") {
                    newFilePath = newFilePath.replace("components/", "styles/components/")

                    console.log("NEWFILEPATH", newFilePath)

                    fs.mkdirSync(newFilePath)

                    newFileName = newFilePath + "/" + componentName + ".global.scss";

                    fs.writeFile(newFileName, "", (err) => {
                        if (err) throw err;

                        console.log("Created file: ", newFileName);
                    });
                }
            });
        });
    });

return