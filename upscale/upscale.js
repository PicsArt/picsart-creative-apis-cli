const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const os = require("os");
const glob = require('glob');
const FormData = require('form-data');
const { processImages, isValidUrl } = require('../utils/processImages.js');

const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.mpo'];

const createUpscaleCommand = (cliOptions, loadApiKey) => {
  const command = new Command('upscale')
    .description(cliOptions.commands.upscale.description)
    .requiredOption(cliOptions.commands.upscale.options.output.flags, cliOptions.commands.upscale.options.output.description)
    .requiredOption(cliOptions.commands.upscale.options.zoom.flags, cliOptions.commands.upscale.options.zoom.description)
    .option(cliOptions.commands.upscale.options.input.flags, cliOptions.commands.upscale.options.input.description)
    .option(cliOptions.commands.upscale.options.apikey.flags, cliOptions.commands.upscale.options.apikey.description)
    .action(async (options) => {
      const { input, output, zoom, apikey } = options;
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

          const unsupportedFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return !supportedFormats.includes(ext);
          });

          if (unsupportedFiles.length > 0) {
            console.error(`Unsupported file formats: ${unsupportedFiles.join(', ')}`);
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
          await processImages(files, output, `upscaled-${zoom}`, apiKey, 'https://api.picsart.io/tools/1.0/upscale', zoom, null, (input) => {
            const form = new FormData();
            form.append('image', fs.createReadStream(input));
            form.append('upscale_factor', zoom);
            return form;
          });

          fs.unlinkSync(inputFilePath);
        });
        return;
      }

      const url = 'https://api.picsart.io/tools/1.0/upscale';
      await processImages(files, output, `upscaled-${zoom}`, apiKey, url, zoom, null, (input) => {
        const form = new FormData();
        form.append('image', fs.createReadStream(input));
        form.append('upscale_factor', zoom);
        return form;
      });
    });

  return command;
};

module.exports = createUpscaleCommand;
