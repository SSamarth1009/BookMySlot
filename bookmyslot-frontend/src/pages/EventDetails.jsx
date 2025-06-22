import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/events/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch event details");
        return res.json();
      })
      .then(data => {
        setEvent(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!name || !email || !selectedSlot) {
      setBookingStatus({ success: false, message: "Please fill all fields" });
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/events/${id}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeslot_id: selectedSlot, name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBookingStatus({ success: false, message: data.message || "Booking failed" });
      } else {
        setBookingStatus({ success: true, message: "Booking successful!" });
        setName("");
        setEmail("");
        setSelectedSlot("");
      }
    } catch {
      setBookingStatus({ success: false, message: "Network error. Please try again." });
    }
  };

  if (loading) return <p className="p-8">Loading event details...</p>;
  if (error) return <p className="p-8 text-red-600">Error: {error}</p>;
  if (!event) return <p className="p-8">Event not found.</p>;

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
      <p className="mb-6 text-gray-700">{event.description}</p>

      <h3 className="text-xl font-semibold mb-2">Available Timeslots</h3>
      {event.slots.length === 0 ? (
        <p>No timeslots available for this event.</p>
      ) : (
        <ul className="mb-6">
          {event.slots.map(slot => (
            <li key={slot.id} className="mb-1">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="timeslot"
                  value={slot.id}
                  checked={selectedSlot === slot.id.toString()}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="mr-2"
                />
                {new Date(slot.time).toLocaleString()} (Max bookings: {slot.max_bookings})
              </label>
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-xl font-semibold mb-2">Book a Slot</h3>
      <form onSubmit={handleBooking} className="space-y-4 max-w-sm">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border border-gray-300 rounded p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Your Email"
          className="w-full border border-gray-300 rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Book Now
        </button>
      </form>

      {bookingStatus && (
        <p className={`mt-4 ${bookingStatus.success ? "text-green-600" : "text-red-600"}`}>
          {bookingStatus.message}
        </p>
      )}
    </div>
  );
}

export default EventDetails;
