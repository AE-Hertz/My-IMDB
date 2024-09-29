import privateClient from "../client/private.client.js";
import publicClient from "../client/public.client.js";

const userEndpoints = {
    signin: "user/signin",
    signup: "user/signup",
    getInfo: "user/info",
    passwordUpdate: "user/update-password",
};

const userApi = {
    signin: async ({ username, password }) => {
        try {
            const response = await publicClient.post(userEndpoints.signin, {
                username,
                password,
            });
            return { response };
        } catch (err) {
            return { err };
        }
    },
    signup: async ({ username, password, confirmPassword, displayName }) => {
        try {
            const response = await publicClient.post(userEndpoints.signup, {
                username,
                password,
                confirmPassword,
                displayName,
            });
            return { response };
        } catch (err) {
            return { err };
        }
    },
    getInfo: async () => {
        try {
            const response = await privateClient.post(userEndpoints.getInfo);
            return { response };
        } catch (err) {
            return { err };
        }
    },
    passwordUpdate: async ({ password, newPassword, confirmnewPassword }) => {
        try {
            const response = await privateClient.put(userEndpoints.signup, {
                password,
                newPassword,
                confirmnewPassword,
            });
            return { response };
        } catch (err) {
            return { err };
        }
    },
};


export default userApi