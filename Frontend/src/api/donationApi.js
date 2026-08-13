import api from "./axios";

// Donor: Create donation
export const createDonation = async (donationData) => {
  const response = await api.post("/donations", donationData);
  return response.data;
};

// Donor: Get my donations
export const getMyDonations = async () => {
  const response = await api.get("/donations");
  return response.data;
};

// Donor: Update donation
export const updateDonation = async (donationId, donationData) => {
  const response = await api.patch(`/donations/${donationId}`, donationData);
  return response.data;
};

// Donor: Delete donation
export const deleteDonation = async (donationId) => {
  const response = await api.delete(`/donations/${donationId}`);
  return response.data;
};

// NGO/Volunteer: Get available donations
export const getAvailableDonations = async () => {
  const response = await api.get("/donations/available");
  return response.data;
};

// NGO/Volunteer: Get single available donation
export const getAvailableDonation = async (donationId) => {
  const response = await api.get(`/donations/available/${donationId}`);
  return response.data;
};

// NGO/Volunteer: Claim donation
export const claimDonation = async (donationId) => {
  const response = await api.post(`/donations/available/${donationId}/claim`);
  return response.data;
};

// NGO/Volunteer: Get my claimed donations
export const getMyClaimedDonations = async () => {
  const response = await api.get("/donations/my-claimed");
  return response.data;
};

// NGO/Volunteer: Complete donation
export const completeDonation = async (donationId) => {
  const response = await api.post(`/donations/my-claimed/${donationId}/complete`);
  return response.data;
};

// Donor: AI suggestions (multipart/form-data)
export const getAISuggestions = async (category, imageFile) => {
  const formData = new FormData();
  formData.append("category", category);
  formData.append("file", imageFile);
  
  const response = await api.post("/donations/ai-suggest", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
