const userService = require('./userServices')

const createUserControllerFn = async (req, res) => {
    try{
        console.log(req.body)
        const status = await userService.createUserDBService(req.body)
        console.log(status)

        if(status) res.send({
            "status" : true,
            "message" : "User created succesfully"
        })
        else res.send({
            "status" : false,
            "message" : "Error on creating user"
        })
    } catch(error) {
        console.log(error)
        res.status(500).send({
            "status" : false, 
            "message" : "Internal server error"
        })
    }
}

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