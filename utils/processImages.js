const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
};

const getOutputPath = (input, output, suffix) => {
  const inputFileName = path.basename(input, path.extname(input));
  const outputDir = fs.lstatSync(output).isDirectory() ? output : path.dirname(output);
  const extension = path.extname(input);
  return path.join(outputDir, `${inputFileName}-${suffix}${extension}`);
};

const processImages = async (inputFiles, outputDir, suffix, apiKey, url, upscaleFactor = null, bgColor = null, formDataFunc) => {
  for (const input of inputFiles) {
    console.log(`Processing: ${input}`);
    
    let form;
    
    if (isValidUrl(input)) {
      form = new FormData();
      if (upscaleFactor) {
        form.append('upscale_factor', upscaleFactor);
      }
      form.append('image_url', input);
    } else {
      form = formDataFunc(input); 
    }

    if (bgColor) {
      form.append('bg_color', bgColor);
    }

    try {
      const response = await axios.post(url, form, {
        headers: {
          ...form.getHeaders(),
          'X-Picsart-API-Key': apiKey,
          'X-Picsart-Plugin': 'Cli'
        },
      });

      console.log(`Response for ${input}: ${response.status}`);

      if (response.status === 200) {
        const uri = response.data.data.url; 
        console.log(`Downloading image from ${uri}...`);

        const getResponse = await axios.get(uri, { responseType: 'arraybuffer' });
        const outputFilePath = getOutputPath(input, outputDir, suffix); 
        fs.writeFileSync(outputFilePath, getResponse.data); 
        console.log(`Image saved successfully to ${outputFilePath}`);
      } else {
        console.error(`Error processing ${input}: ${response.status} - ${response.data.message || response.data}`);
      }
    } catch (error) {
      if (error.response) {
        console.error(`Error processing ${input}: ${error.response.status} - ${error.response.data.message || error.response.data}`);
      } else if (error.request) {
        console.error(`Error processing ${input}: No response received from the server`);
      } else {
        console.error(`Error processing ${input}: ${error.message}`);
      }
    }
  }
};

module.exports = {
  processImages,
  isValidUrl,
  getOutputPath,
};
