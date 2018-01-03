module.exports = {
    'secret': 'nodeauthsecret',
    'database': process.ENV.MONGODB_URL || 'mongodb://localhost:27017/lux'
};
