import { useState } from "react";

function UserBookings() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBookings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBookings([]);
    setError("");

    try {
      const res = await fetch(`http://localhost:3000/users/${email}/bookings`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch bookings");

      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>

      <form onSubmit={fetchBookings} className="mb-6 space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          View My Bookings
        </button>
      </form>

      {loading && <p>Loading bookings...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {bookings.length > 0 && (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking.booking_id} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-lg">{booking.event_title}</h3>
              <p className="text-gray-700">
                Time: {new Date(booking.slot_time).toLocaleString()}
              </p>
              <p className="text-gray-600">Booked as: {booking.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserBookings;
