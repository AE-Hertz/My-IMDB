import responseHandler from "../handler/response.handler.js";
import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";

const signup = async (req, res) => {
    try {
        const { username, password, displayName } = req.body;

        const checkUser = await userModel.findOne({ username });

        if (checkUser)
            return responseHandler.badrequest(res, "username already exists");

        const user = new userModel();
        user.displayName = displayName;
        user.username = username;
        user.setPassword(password);

        await user.save();

        const token = jsonwebtoken.sign(
            {
                data: user.id,
            },
            process.env.TOKEN_SECRET,
            { expiresIN: "24h" }
        );

        responseHandler.created(res, {
            token,
            ...user._doc,
            id: user.id,
        });
    } catch {
        responseHandler.error(res);
    }
};

const signin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userModel
            .findOne({ username })
            .select("username password salt id displayName");

        if (!user)
            return responseHandler.badrequest(res, "User does not exist");

        if (!user.validPassword(password))
            return responseHandler.badrequest(res, "Wrong Password");

        const token = jsonwebtoken.sign(
            {
                data: user.id,
            },
            process.env.TOKEN_SECRET,
            { expiresIN: "24h" }
        );

        user.password = undefined;
        user.salt = undefined;

        responseHandler.created(res, {
            token,
            ...user._doc,
            id: user.id,
        });
    } catch {
        responseHandler.error(res);
    }
};

const updatePassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;

        const user = await userModel
            .findById(req.user.id)
            .select("password id salt");

        if (!user) return responseHandler.unauthorize(res);

        if (!user.validPassword(password))
            return responseHandler.badrequest(res, "Wrong Password");

        user.setPassword(newPassword);

        await user.save();

        responseHandler.ok(res);
    } catch {
        responseHandler.error(res);
    }
};

const getInfo = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) return responseHandler.notfound(res);
        responseHandler.ok(res, user);
    } catch {
        responseHandler.error(res);
    }
};

export default { signup, signin, getInfo, updatePassword };
