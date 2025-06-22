import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Events</h2>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {events.map(event => (
            <li key={event.id} className="bg-white p-4 rounded shadow">
              <Link
                to={`/events/${event.id}`}
                className="text-blue-600 hover:underline font-semibold text-lg"
              >
                {event.title}
              </Link>
              <p className="text-gray-700">{event.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
