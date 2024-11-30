const os = require('os');

const getApiKeyPath = () => {
    const platform = os.platform();
    return platform === 'win32'
      ? path.join(process.env.USERPROFILE, '.picsart_apikey')
      : '/etc/.picsart_apikey';
};

module.exports = {
    getApiKeyPath,
}