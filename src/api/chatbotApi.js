import axiosClient from "./axiosClient";


export const sendChatbot = async ({ message, image }) => {
  const formData = new FormData();

  if (message) {
    formData.append("message", message);
  }

  if (image) {
    formData.append("image", image);
  }

  const response = await axiosClient.post(
    "/chatbot",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
         "ngrok-skip-browser-warning": "true"
      },

    }
  );

  return response.data;
};
