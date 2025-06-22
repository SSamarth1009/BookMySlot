// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const db = require("./db");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Root route
// app.get("/", (req, res) => {
//   res.send("Welcome to BookMySlot backend!");
// });

// // Test DB connection
// app.get("/test-db", async (req, res) => {
//   try {
//     const result = await db.query("SELECT * FROM events");
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Database error:", err.stack);
//     res.status(500).json({ message: "Database error", error: err.message });
//   }
// });

// // Create an event with timeslots
// app.post("/events", async (req, res) => {
//   const { title, description, slots, maxBookingsPerSlot } = req.body;

//   if (!title || !slots || !Array.isArray(slots) || slots.length === 0 || !maxBookingsPerSlot) {
//     return res.status(400).json({ message: "Missing or invalid fields" });
//   }

//   try {
//     const result = await db.query(
//       "INSERT INTO events (title, description) VALUES ($1, $2) RETURNING id",
//       [title, description]
//     );
//     const eventId = result.rows[0].id;

//     // Insert all timeslots for the event
//     const slotPromises = slots.map(slot =>
//       db.query(
//         "INSERT INTO timeslots (event_id, time, max_bookings) VALUES ($1, $2, $3)",
//         [eventId, slot, maxBookingsPerSlot]
//       )
//     );
//     await Promise.all(slotPromises);

//     res.status(201).json({ message: "Event created", eventId });
//   } catch (err) {
//     console.error("Error creating event:", err.stack);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // List all events
// app.get("/events", async (req, res) => {
//   try {
//     const result = await db.query("SELECT * FROM events ORDER BY created_at DESC");
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching events:", err.stack);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // Get event details with timeslots
// app.get("/events/:id", async (req, res) => {
//   const eventId = req.params.id;

//   try {
//     const eventResult = await db.query(
//       "SELECT id, title, description FROM events WHERE id = $1",
//       [eventId]
//     );

//     if (eventResult.rows.length === 0) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     const event = eventResult.rows[0];

//     const slotsResult = await db.query(
//       "SELECT id, time, max_bookings FROM timeslots WHERE event_id = $1 ORDER BY time ASC",
//       [eventId]
//     );

//     event.slots = slotsResult.rows;

//     res.json(event);
//   } catch (err) {
//     console.error("Error fetching event details:", err.stack);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // Book a slot for an event
// app.post("/events/:id/bookings", async (req, res) => {
//   const eventId = req.params.id;
//   const { timeslot_id, name, email } = req.body;

//   if (!timeslot_id || !name || !email) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     // Check if timeslot belongs to event
//     const timeslotCheck = await db.query(
//       "SELECT * FROM timeslots WHERE id = $1 AND event_id = $2",
//       [timeslot_id, eventId]
//     );

//     if (timeslotCheck.rows.length === 0) {
//       return res.status(404).json({ message: "Timeslot not found for this event" });
//     }

//     const timeslot = timeslotCheck.rows[0];

//     // Count existing bookings for this timeslot
//     const bookingCountRes = await db.query(
//       "SELECT COUNT(*) FROM bookings WHERE timeslot_id = $1",
//       [timeslot_id]
//     );

//     const currentBookings = parseInt(bookingCountRes.rows[0].count, 10);

//     if (currentBookings >= timeslot.max_bookings) {
//       return res.status(400).json({ message: "Timeslot is fully booked" });
//     }

//     // Insert booking
//     await db.query(
//       "INSERT INTO bookings (timeslot_id, name, email) VALUES ($1, $2, $3)",
//       [timeslot_id, name, email]
//     );

//     res.status(201).json({ message: "Booking successful" });
//   } catch (err) {
//     console.error("Error booking slot:", err.stack);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // Get all bookings for a user by email
// app.get("/users/:email/bookings", async (req, res) => {
//   const userEmail = req.params.email;

//   try {
//     const result = await db.query(
//       `SELECT b.id as booking_id, b.name, b.email, b.created_at as booking_time,
//               t.id as timeslot_id, t.time as slot_time, t.max_bookings,
//               e.id as event_id, e.title as event_title, e.description as event_description
//        FROM bookings b
//        JOIN timeslots t ON b.timeslot_id = t.id
//        JOIN events e ON t.event_id = e.id
//        WHERE b.email = $1
//        ORDER BY b.created_at DESC`,
//       [userEmail]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "No bookings found for this user" });
//     }

//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error fetching user bookings:", err.stack);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // Optional: Catch-all for unknown routes (recommended)
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const { DateTime } = require("luxon");

const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to BookMySlot backend!");
});

// Test DB connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM events");
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err.stack);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

// Create an event with timeslots
app.post("/events", async (req, res) => {
  const { title, description, slots, maxBookingsPerSlot } = req.body;

  if (!title || !slots || !Array.isArray(slots) || slots.length === 0 || !maxBookingsPerSlot) {
    return res.status(400).json({ message: "Missing or invalid fields" });
  }

  try {
    const result = await db.query(
      "INSERT INTO events (title, description) VALUES ($1, $2) RETURNING id",
      [title, description]
    );
    const eventId = result.rows[0].id;

    const slotPromises = slots.map(slot =>
      db.query(
        "INSERT INTO timeslots (event_id, time, max_bookings) VALUES ($1, $2, $3)",
        [eventId, slot, maxBookingsPerSlot]
      )
    );
    await Promise.all(slotPromises);

    res.status(201).json({ message: "Event created", eventId });
  } catch (err) {
    console.error("Error creating event:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// List all events
app.get("/events", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM events ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching events:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get event details with timeslots (timezone aware)
app.get("/events/:id", async (req, res) => {
  const eventId = req.params.id;
  const tz = req.query.tz || "UTC";

  try {
    const eventResult = await db.query(
      "SELECT id, title, description FROM events WHERE id = $1",
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventResult.rows[0];

    const slotsResult = await db.query(
      "SELECT id, time, max_bookings FROM timeslots WHERE event_id = $1 ORDER BY time ASC",
      [eventId]
    );

    event.slots = slotsResult.rows.map(slot => {
      const convertedTime = DateTime.fromJSDate(slot.time, { zone: "utc" }).setZone(tz).toISO();
      return {
        id: slot.id,
        time: convertedTime,
        max_bookings: slot.max_bookings,
      };
    });

    res.json(event);
  } catch (err) {
    console.error("Error fetching event details:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Book a slot for an event with unique booking check
app.post("/events/:id/bookings", async (req, res) => {
  const eventId = req.params.id;
  const { timeslot_id, name, email } = req.body;

  if (!timeslot_id || !name || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const timeslotCheck = await db.query(
      "SELECT * FROM timeslots WHERE id = $1 AND event_id = $2",
      [timeslot_id, eventId]
    );

    if (timeslotCheck.rows.length === 0) {
      return res.status(404).json({ message: "Timeslot not found for this event" });
    }

    const timeslot = timeslotCheck.rows[0];

    const bookingCountRes = await db.query(
      "SELECT COUNT(*) FROM bookings WHERE timeslot_id = $1",
      [timeslot_id]
    );

    const currentBookings = parseInt(bookingCountRes.rows[0].count, 10);

    if (currentBookings >= timeslot.max_bookings) {
      return res.status(400).json({ message: "Timeslot is fully booked" });
    }

    await db.query(
      "INSERT INTO bookings (timeslot_id, name, email) VALUES ($1, $2, $3)",
      [timeslot_id, name, email]
    );

    res.status(201).json({ message: "Booking successful" });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "You have already booked this timeslot" });
    }
    console.error("Error booking slot:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all bookings for a user by email
app.get("/users/:email/bookings", async (req, res) => {
  const userEmail = req.params.email;

  try {
    const result = await db.query(
      `SELECT b.id as booking_id, b.name, b.email, b.created_at as booking_time,
              t.id as timeslot_id, t.time as slot_time, t.max_bookings,
              e.id as event_id, e.title as event_title, e.description as event_description
       FROM bookings b
       JOIN timeslots t ON b.timeslot_id = t.id
       JOIN events e ON t.event_id = e.id
       WHERE b.email = $1
       ORDER BY b.created_at DESC`,
      [userEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user bookings:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Cancel a booking by ID
app.delete("/bookings/:id", async (req, res) => {
  const bookingId = req.params.id;

  try {
    const deleteResult = await db.query("DELETE FROM bookings WHERE id = $1 RETURNING *", [bookingId]);

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking cancelled successfully", booking: deleteResult.rows[0] });
  } catch (err) {
    console.error("Error cancelling booking:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete an event and its timeslots/bookings
app.delete("/events/:id", async (req, res) => {
  const eventId = req.params.id;

  try {
    // Delete all bookings for this event's timeslots
    await db.query(`
      DELETE FROM bookings
      WHERE timeslot_id IN (
        SELECT id FROM timeslots WHERE event_id = $1
      )
    `, [eventId]);

    // Delete timeslots
    await db.query("DELETE FROM timeslots WHERE event_id = $1", [eventId]);

    // Delete event
    const result = await db.query("DELETE FROM events WHERE id = $1 RETURNING *", [eventId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully", event: result.rows[0] });
  } catch (err) {
    console.error("Error deleting event:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
