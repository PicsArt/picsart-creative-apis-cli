const { Command } = require("commander");
const axios = require("axios");
const { loadApiKey } = require('../utils/loadApiKey.js');

const createCreditCommand = (cliOptions) => {
  return new Command()
    .command('credit') 
    .description(cliOptions.commands.credit.description)
    .option(cliOptions.commands.credit.options.key.flags, cliOptions.commands.credit.options.key.description)
    .action(async (options) => {
      const apiKey = options.apikey || loadApiKey();

      if (!apiKey) {
        console.error('Error: API key is required. Please provide it using --apikey option or save it using the save command.');
        process.exit(1);
      }

      try {
        const response = await axios.get('https://api.picsart.io/tools/1.0/balance', {
          headers: {
            'X-Picsart-API-Key': apiKey,
            'X-Picsart-Plugin': 'Cli'
          },
        });

        if (response.status === 200) {
          console.log(`Your remaining credit balance: ${response.data.credits}`);
        } else {
          console.error(`Failed to retrieve credit balance: ${response.status}`);
        }
      } catch (error) {
        if (error.response) {
          console.error(`Error: ${error.response.status} - ${error.response.data.message || error.response.data}`);
        } else if (error.request) {
          console.error('Error: No response received from the server.');
        } else {
          console.error(`Error: ${error.message}`);
        }
      }
    });
};

module.exports = createCreditCommand;
