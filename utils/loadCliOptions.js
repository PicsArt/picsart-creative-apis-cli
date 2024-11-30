const path = require('path');
const fs = require('fs');
const yaml = require('yaml');

const loadCliOptions = () => {
    const yamlFilePath = path.join(__dirname, '../help/cli-options.yaml');
    const file = fs.readFileSync(yamlFilePath, 'utf8');
    return yaml.parse(file);
};

module.exports = {
    loadCliOptions
}