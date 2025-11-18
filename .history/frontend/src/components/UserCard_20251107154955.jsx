//src

export default function UserCard({ user }) {
    return (
        <div className="border p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col">
            <h2 className="text-lg font-bold text-brightGreen">{user.firstName} {user.lastName}</h2>
            <p>Email: {user.email}</p>
            <p>Location: {user.location}</p>
            <p>Budget: ${user.budgetMin} - ${user.budgetMax}</p>
            <p>Hobbies: {user.hobbies}</p>
        </div>
    );
}
