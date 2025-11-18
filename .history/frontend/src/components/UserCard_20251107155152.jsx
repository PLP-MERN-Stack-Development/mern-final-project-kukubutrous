// src/components/UserCard.jsx
export default function UserCard({ user, onClick }) {
    return (
        <div
            className="border p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col cursor-pointer bg-white"
            onClick={onClick}
        >
            <h2 className="text-lg font-bold text-brightGreen">
                {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-700">Email: {user.email}</p>
            <p className="text-sm text-gray-700">Location: {user.location}</p>
            <p className="text-sm text-gray-700">
                Budget: ${user.budgetMin} - ${user.budgetMax}
            </p>
            <p className="text-sm text-gray-700">
                Hobbies: {Array.isArray(user.hobbies) ? user.hobbies.join(", ") : user.hobbies}
            </p>
            <p className="text-sm text-gray-700">
                Room Type: {user.roomType}
            </p>
            <p className="text-sm text-gray-700">
                Preferred Gender: {Array.isArray(user.genders) ? user.genders.join(", ") : user.genders}
            </p>
        </div>
    );
}
