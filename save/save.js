const fs = require("fs");
const path = require("path");
const { Command } = require("commander");

const { getApiKeyPath } = require('../utils/getApiKeyPath.js');

const createSaveCommand = (cliOptions) => {
  return new Command()  
    .command('save')      
    .description(cliOptions.commands.save.description)
    .requiredOption(cliOptions.commands.save.options.key.flags, cliOptions.commands.save.options.key.description)
    .action(async (options) => {
      const { apikey } = options;  
      if (!apikey) {  
        console.error("Error: API key is required.");
        process.exit(1);
      }

      const apiKeyPath = getApiKeyPath();

      try {
        fs.accessSync(path.dirname(apiKeyPath), fs.constants.W_OK);
        fs.writeFileSync(apiKeyPath, apikey, { mode: 0o644 });  
        console.log(`API key saved successfully to ${apiKeyPath}`);
      } catch (error) {
        if (error.code === 'EACCES') {
          console.error(`Error: Saving API key requires administrator permissions. Please run the command with elevated privileges.`);
        } else {
          console.error(`Error saving API key: ${error.message}`);
        }
      }
    });
};

module.exports = createSaveCommand;
