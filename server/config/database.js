module.exports = {
    'secret': process.env.JWT_SECRET || 'nodeauthsecret',
    'database': process.env.MONGODB_URI || 'mongodb://localhost:27017/spoqn'
};
