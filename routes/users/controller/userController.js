const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {

    register: function(params) {
        return new Promise(function(resolve, reject) {

            User.findOne({email: params.email})
                .then(user => {
                  if (user) {
                    let errors = {};
                    errors.email = "Email already exists";
                    errors.status = 400;
                    return reject(errors);
                  } else {
                    const newUser = new User({
                                                username: params.username,
                                                email: params.email,
                                                password: params.password
                                            });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                throw err;
                            } else {
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => resolve(user))
                                    .catch(err => reject(err));
                            }
                        })
                    })
                  }
                })
                

        });
    }, login: function(params) {

        const email = params.email;
        const password = params.password;

        return new Promise(function(resolve, reject) {

            User
            .findOne({email})
            .then(user => {
                if (!user) {
                    let errors = {};
                    errors.email = "User not found";
                    errors.status = 400;
                    reject(errors);
                } else {

                    bcrypt
                        .compare(password, user.password)
                        .then(isMatch => {

                            if (isMatch) {
                                const payload = {
                                    id: user._id,
                                    email: user.email,
                                    username: user.username
                                }

                                jwt.sign(payload, process.env.SECRET_KEY, {
                                    expiresIn: 3600
                                }, (err, token) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        let success = {};
                                        success.confirmation = true;
                                        success.token = "Bearer " + token;
                                        resolve(success);
                                    }
                                })

                            } else {
                                let errors = {};
                                errors.password = "Password incorrect";
                                errors.status = 400;
                                reject(errors)
                            }

                         

    

                        })

                }
            })
            

        })
        

    }


}