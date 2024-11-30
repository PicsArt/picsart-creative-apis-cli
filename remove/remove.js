const { Command } = require("commander");
const fs = require("fs");
const { getApiKeyPath } = require('../utils/getApiKeyPath.js');

const createRemoveCommand = (cliOptions) => {
  return new Command()
    .command('remove')
    .description(cliOptions.commands.remove.description)
    .action(async () => {
      const apiKeyPath = getApiKeyPath();
      try {
        fs.unlinkSync(apiKeyPath);
        console.log(`API key removed successfully from ${apiKeyPath}`);
      } catch (error) {
        console.error(`Error removing API key: ${error.message}`);
      }
    });
};

module.exports = createRemoveCommand;
