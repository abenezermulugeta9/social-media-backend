import UserModel from "../models/user.js";
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    username,
    password: hashedPassword,
    firstName,
    lastName,
  });

  try {
    await newUser.save();
    res.status(201).json(newUser); 
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async(req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username: username }); 

        if(user) { 
            const isValid = await bcrypt.compare(password, user.password); 
            isValid ? res.status(200).json(user) : res.status(400).json(`Wrong password.`);
        }else {
            res.status(404).json(`User doesn't exist.`);
        }
    } catch (error) {
        
    }
}
