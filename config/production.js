const mongoUri = "mongodb://127.0.0.1:27017"
const mongoUriParam = 'authSource=admin&replicaSet=mgset-6570511&poolSize=5'
module.exports = {
    mongoUri,
    mongoUriParam,
    session: {
        url: `${mongoUri}/?${mongoUriParam}`,
        db: 'video',
        collection: 'sessions',
        maxAge: 24 * 60 * 60,
    },
};