import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

export default function RoommateCard({ user }) {
  const { setActiveChat, chats } = useContext(ChatContext);

  const startChat = () => {
    // Check if chat already exists
    const existing = chats.find(
      c => c.user1.id === user.id || c.user2.id === user.id
    );
    setActiveChat(existing || { id: null, user1: null, user2: user });
  };

  return (
    <div className="bg-white shadow rounded p-4 flex flex-col gap-2 hover:shadow-md transition cursor-pointer" onClick={startChat}>
      <h4 className="font-bold">{user.firstName} {user.lastName}</h4>
      <p>Location: {user.location || 'N/A'}</p>
      <p>Room Type: {user.roomType || 'N/A'}</p>
      <p>Budget: ${user.budgetMin || 0} - ${user.budgetMax || 0}</p>
      <p>Hobbies: {user.hobbies || 'None'}</p>
      <p>Gender: {user.gender || 'N/A'}</p>
    </div>
  );
}
