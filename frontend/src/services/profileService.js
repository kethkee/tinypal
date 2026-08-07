import api from "./api";

export const createProfile = async (profileData) => {

    const response = await api.post(
        "/profile/",
        profileData
    );

    return response.data;

};