import axiosInstance from "./axiosInstance";

// REGISTER
export async function registerAPI(data) {
  try {

    const res = await axiosInstance.post(
      "/user/register",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;

  } catch (err) {

    console.log("REGISTER ERROR FULL:", err);

    console.log("RESPONSE DATA:", err?.response?.data);

    throw err?.response?.data || err;
  }
}

// LOGIN
export async function loginAPI(data) {

  try {

    const res = await axiosInstance.post(
      "/user/login",
      data
    );

    return res.data;

  } catch (err) {

    console.log("LOGIN ERROR FULL:", err);

    console.log("RESPONSE DATA:", err?.response?.data);

    throw err?.response?.data || err;
  }
}



