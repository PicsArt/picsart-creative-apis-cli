const fs = require('fs');
const { getApiKeyPath } = require('./getApiKeyPath');

const loadApiKey = () => {
    const apiKeyPath = getApiKeyPath();
    if (fs.existsSync(apiKeyPath)) {
      return fs.readFileSync(apiKeyPath, 'utf-8').trim();
    }
    return null;
};

module.exports = {
    loadApiKey,
}