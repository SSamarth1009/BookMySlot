import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import UserBookings from "./pages/UserBookings";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="p-4 bg-blue-600 text-white flex justify-between">
        <h1 className="font-bold text-xl">BookMySlot</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/create" className="hover:underline">Create Event</Link>
          <Link to="/bookings" className="hover:underline">My Bookings</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/bookings" element={<UserBookings />} />
      </Routes>
    </div>
  );
}

export default App;
