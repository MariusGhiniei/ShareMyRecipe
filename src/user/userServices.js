const userModel = require('./userModel')
const key = "key1234key567890"
const encrypt = require('simple-encryptor')(key)

module.exports.createUserDBService = (userDetails) => {
    return new Promise(function(resolve, reject) {
        const userModelData = new userModel();

        userModelData.firstName = userDetails.firstName;
        userModelData.lastName = userDetails.lastName;
        userModelData.email = userDetails.email;
        userModelData.country = userDetails.country;
        userModelData.password = userDetails.password;
        const encryptedPass = encrypt.encrypt(userDetails.password);
        userModelData.password = encryptedPass;

        userModelData.save(function(error, result) {
            if (error) {
                console.error("Error while creating user:", error); 
                reject(error);
            } else {
                resolve(true); 
            }
        });
    });
};

module.exports.loginUserDBService = (userDetails) => {
    return new Promise(function(resolve, reject) {
        userModel.findOne({ email: userDetails.email }, function(error, result) {
            if (error) {
                reject({
                    status: false,
                    msg: "Error retrieving user data from the database"
                });
            } else {
                if (result !== undefined && result !== null) {
                    try {
                        const decrypted = encrypt.decrypt(result.password);
                        if (decrypted === userDetails.password) {
                            resolve({
                                status: true,
                                msg: "User validation successful"
                            });
                        } else {
                            reject({
                                status: false,
                                msg: "Incorrect password"
                            });
                        }
                    } catch (decryptionError) {
                        reject({
                            status: false,
                            msg: "Error decrypting password"
                        });
                    }
                } else {
                    reject({
                        status: false,
                        msg: "User not found"
                    });
                }
            }
        });
    });
};
