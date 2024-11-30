# Image Processor CLI
A Command Line Interface (CLI) tool for removing backgrounds and upscaling images using the Picsart API.

## Features
- **Remove Background**: Automatically removes the background from images using the Picsart API.
- **Upscale Images**: Enhances image quality by upscaling the image with various zoom levels.

## Prerequisites
- **Node.js** (v14 or higher)
- **NPM** (comes with Node.js)
- **Picsart API Key**: You can obtain an API key from [Picsart API](https://console.picsart.io/).

## Installation
1. **Clone this repository**:
    ```bash
    git clone https://github.com/eax-academy/cli-plugin
    cd image-processor-cli
    ```
2. **Install the dependencies**:
    ```bash
    npm install
    ```

## Usage
The `image-processor` CLI provides two primary commands:
1. `removebg`: Remove background from an image.
2. `upscale`: Upscale an image to improve quality.

### 1. Remove Background
To remove the background from an image:
```bash
node index.js removebg -i <input_image_path> -o <output_image_path_or_directory> --apikey <your_picsart_api_key>
