import client from "./client";

export const getEmergencyContacts = async () => {
  const { data } = await client.get("/emergency-contacts/mobile");
  return data;
};