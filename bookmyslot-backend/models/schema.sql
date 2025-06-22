CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE timeslots (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  time TIMESTAMP NOT NULL,
  max_bookings INT NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  timeslot_id INT REFERENCES timeslots(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  UNIQUE (email, timeslot_id)
);

