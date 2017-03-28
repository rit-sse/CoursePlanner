module.exports = {
    db: {
        url: 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@ds063546.mlab.com:63546/course-planner',
    },

    jwt: {
        secret: process.env.JWT_SECRET
    },

    google: {
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
};
