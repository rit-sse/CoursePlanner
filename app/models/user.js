'use strict';
var mongoose    = require('mongoose');
var Schema  = mongoose.Schema;
var bcrypt  = require('bcrypt-nodejs');

//Set up a mongoose model

var UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    google: String,
    picture: String,
    displayName: String,
    school: { 
        type: Schema.Types.ObjectId, 
        ref: 'School' ,
    },
    lastPlan: {
        type: Schema.Types.ObjectId,
        ref: 'Plan'
    }
});


UserSchema.pre('save', function (next){
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    }   else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', UserSchema);


module.exports = User;
