import { useState } from "react";

function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slots, setSlots] = useState([""]);
  const [maxBookings, setMaxBookings] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSlotChange = (index, value) => {
    const newSlots = [...slots];
    newSlots[index] = value;
    setSlots(newSlots);
  };

  const addSlotField = () => setSlots([...slots, ""]);

  const removeSlotField = (index) => {
    const newSlots = slots.filter((_, i) => i !== index);
    setSlots(newSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!title || !slots.length || !maxBookings || slots.some((s) => !s)) {
      setStatus({ success: false, message: "Please fill all fields correctly." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          slots,
          maxBookingsPerSlot: maxBookings,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ success: false, message: data.message || "Event creation failed." });
      } else {
        setStatus({ success: true, message: "Event created successfully!" });
        // Clear form
        setTitle("");
        setDescription("");
        setSlots([""]);
        setMaxBookings("");
      }
    } catch (err) {
      setStatus({ success: false, message: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Event Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Event Description (optional)"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="space-y-2">
          <label className="block font-medium">Slot Times (ISO format or readable)</label>
          {slots.map((slot, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="datetime-local"
                value={slot}
                onChange={(e) => handleSlotChange(index, e.target.value)}
                className="w-full border p-2 rounded"
              />
              {slots.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSlotField(index)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSlotField}
            className="text-blue-600 hover:underline text-sm"
          >
            + Add another slot
          </button>
        </div>

        <input
          type="number"
          placeholder="Max Bookings Per Slot"
          className="w-full border p-2 rounded"
          value={maxBookings}
          onChange={(e) => setMaxBookings(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white rounded ${
            loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>

      {status && (
        <p className={`mt-4 ${status.success ? "text-green-600" : "text-red-600"}`}>
          {status.message}
        </p>
      )}
    </div>
  );
}

export default CreateEvent;
