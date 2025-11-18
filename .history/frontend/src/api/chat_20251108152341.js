import { apiClient } from "./apiClient";

export const getChats = async () => {
  const res = await apiClient.get("/chats");
  return res.data.chats;
};

export const sendMessage = async (chatId, text) => {
  const res = await apiClient.post("/chats/send", { chatId, text });
  return res.data;
};

export const getMessages = async (chatId) => {
  const res = await apiClient.get(`/chats/${chatId}/messages`);
  return res.data.messages;
};
