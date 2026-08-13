import api from "./axios";

export const createVerificationRequest = async (formData) => {
  // formData is already a FormData object with all the fields
  const response = await api.post("/verification/request", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getPendingVerifications = async () => {
  const response = await api.get("/verification/pending");
  return response.data;
};
