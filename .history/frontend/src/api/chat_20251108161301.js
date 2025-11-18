import apiClient from './apiClient';

export const getChats = () => apiClient.get('/chats');
export const getMessages = (chatId) => apiClient.get(`/chats/${chatId}/messages`);
export const sendMessage = (chatId, text) => apiClient.post('/chats/send', { recipientId: chatId, text });
