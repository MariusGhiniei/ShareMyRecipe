const userService = require('./userServices');

const createUserControllerFn = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        
        // Call createUserDBService from userService to create a new user
        const status = await userService.createUserDBService(req.body);

        // Check the status returned by createUserDBService
        if (status) {
            // If user creation is successful, send a success response
            return res.status(201).json({
                status: true,
                message: "User created successfully"
            });
        } else {
            // If user creation fails, send an error response
            return res.status(400).json({
                status: false,
                message: "Error creating user"
            });
        }
    } catch (error) {
        // If an error occurs during user creation or processing, log the error and send an internal server error response
        console.error("Error creating user:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};


const loginUserControllerFn = async (req, res) => {
    try {
        console.log("Login Request Body:", req.body);

        const result = await userService.loginUserDBService(req.body);
        console.log("Login Result:", result);

        if (result.status) {
            res.status(200).json({
                status: true,
                message: result.msg
            });
        } else {
            res.status(401).json({
                status: false,
                message: result.msg
            });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};



module.exports = {createUserControllerFn, loginUserControllerFn}