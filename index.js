#!/usr/bin/env node
const { Command } = require("commander");

const createRemoveBgCommand = require('./removebg/removeBg.js');
const createUpscaleCommand = require('./upscale/upscale.js'); 
const createSaveCommand = require('./save/save.js');  
const createCreditCommand = require('./credit/credit.js');  
const createRemoveCommand = require('./remove/remove.js');  

const { loadCliOptions } = require('./utils/loadCliOptions.js');
const { loadApiKey } = require('./utils/loadApiKey.js');

const program = new Command();

const cliOptions = loadCliOptions();

program
  .name('image-processor')
  .description(cliOptions.description)
  .version(cliOptions.version)
  .helpOption(cliOptions.helpOption.flags, cliOptions.helpOption.description);

program.addCommand(createRemoveBgCommand(cliOptions));
program.addCommand(createUpscaleCommand(cliOptions, loadApiKey));
program.addCommand(createSaveCommand(cliOptions));  
program.addCommand(createCreditCommand(cliOptions, loadApiKey));  
program.addCommand(createRemoveCommand(cliOptions)); 

program.parse(process.argv);
