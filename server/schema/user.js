const mongoose = require('mongoose'),
    bCrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    telephone: {
        type: String,
        required: false,
    },
    friends: {
        type: [String]
    },
    image: {
        data: {
            type: Buffer
        },
        contentType: {
            type: String
        }
    }
});

UserSchema.pre('save', function (next) {
    let user = this;

    if (this.isModified('password') || this.isNew) {
        bCrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bCrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bCrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('users', UserSchema);