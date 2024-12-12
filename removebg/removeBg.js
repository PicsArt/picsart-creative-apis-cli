const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const os = require("os");
const glob = require('glob');
const FormData = require('form-data');
const { processImages, isValidUrl } = require('../utils/processImages.js');
const { loadApiKey } = require('../utils/loadApiKey.js');

const createRemoveBgCommand = (cliOptions) => {
  const removebgCommand = new Command('removebg')
    .description(cliOptions.commands.removebg.description)
    .requiredOption(cliOptions.commands.removebg.options.output.flags, cliOptions.commands.removebg.options.output.description)
    .option(cliOptions.commands.removebg.options.input.flags, cliOptions.commands.removebg.options.input.description)
    .option(cliOptions.commands.removebg.options.backgroundColor.flags, cliOptions.commands.removebg.options.backgroundColor.description) 
    .option(cliOptions.commands.removebg.options.apikey.flags, cliOptions.commands.removebg.options.apikey.description) 
    .action(async (options) => {
      const { input, output, apikey, bgColor } = options;
      const apiKey = apikey || loadApiKey();

      if (!apiKey) {
        console.error('Error: API key is required. Please provide it using --apikey option or save it using the save command.');
        process.exit(1);
      }

      let files = [];

      if (input) {
        if (isValidUrl(input)) {
          files = [input];
          console.log(`Input is a valid URL: ${input}`);
        } else {
          files = glob.sync(input);
          console.log(`Matched files: ${files.length > 0 ? files.join(', ') : 'None'}`);

          if (files.length === 0) {
            console.error('No files matched the pattern:', input);
            process.exit(1);
          }
        }
      } else {
        const inputBuffer = [];
        process.stdin.on('data', (chunk) => inputBuffer.push(chunk));
        process.stdin.on('end', async () => {
          const inputFilePath = path.join(os.tmpdir(), 'temp_input.png');
          fs.writeFileSync(inputFilePath, Buffer.concat(inputBuffer));

          files = [inputFilePath];
          await processImages(files, output, 'removedbg', apiKey, 'https://api.picsart.io/tools/1.0/removebg',null, bgColor, (input) => {
            const form = new FormData();
            form.append('image', fs.createReadStream(input));

            if (bgColor) {
              form.append('bg_color', bgColor);
            }
            return form;
          });

          fs.unlinkSync(inputFilePath);
        });
        return;
      }

      const url = 'https://api.picsart.io/tools/1.0/removebg';

      await processImages(files, output, 'removedbg', apiKey, url, null, bgColor, (input) => {
        const form = new FormData();

        if (isValidUrl(input)) {
          form.append('image_url', input);
        } else {
          form.append('image', fs.createReadStream(input));
        }

        if (bgColor) {
          form.append('bg_color', bgColor);
        }

        return form;
      });
    });

  return removebgCommand;
};

module.exports = createRemoveBgCommand;
