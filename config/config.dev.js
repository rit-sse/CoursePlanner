module.exports = {
    db: {
        url: 'mongodb://mongo/' + (process.env.TEST ? 'test' : 'course-planner')
    },

    jwt: {
        secret: process.env.JWT_SECRET
    },

    google: {
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
};
