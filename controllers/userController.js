import UserModel from "../models/user.js";

export const getUser = async(req, res) => {
    const { id } = req.params; 

    try {
        const user = await UserModel.findById(id); 

        if(user) {
            // removes the password from the response object 
            const { password, ...otherDetails } = user._doc;
            res.status(200).json(otherDetails);  
        }else {
            res.status(404).json(`No such user exists`);
        }
    } catch (error) {
        res.status(500).json(error); 
    }
}