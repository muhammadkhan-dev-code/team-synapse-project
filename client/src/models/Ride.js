/**
 * Ride Model
 * Represents a ride listing on the UniRideSync platform.
 */
export class Ride {
  constructor({
    id = '',
    title = '',
    driver = null,
    origin = '',
    destination = '',
    departureTime = '',
    date = '',
    seatsAvailable = 0,
    totalSeats = 0,
    price = 0,
    status = 'active', // 'active' | 'confirmed' | 'completed' | 'cancelled'
    participants = [],
    pendingRequests = [],
    notes = '',
    estimatedTime = '',
  } = {}) {
    this.id = id;
    this.title = title;
    this.driver = driver;
    this.origin = origin;
    this.destination = destination;
    this.departureTime = departureTime;
    this.date = date;
    this.seatsAvailable = seatsAvailable;
    this.totalSeats = totalSeats;
    this.price = price;
    this.status = status;
    this.participants = participants;
    this.pendingRequests = pendingRequests;
    this.notes = notes;
    this.estimatedTime = estimatedTime;
  }

  get seatsLabel() {
    return `${this.seatsAvailable} Seat${this.seatsAvailable !== 1 ? 's' : ''} Left`;
  }
}

/**
 * Participant Model
 * Represents a ride participant (pending or accepted).
 */
export class Participant {
  constructor({
    id = '',
    user = null,
    status = 'pending', // 'pending' | 'accepted' | 'declined'
    joinedAt = '',
  } = {}) {
    this.id = id;
    this.user = user;
    this.status = status;
    this.joinedAt = joinedAt;
  }
}

/**
 * RideHistory Model
 * Represents a completed ride in history.
 */
export class RideHistory {
  constructor({
    id = '',
    origin = '',
    destination = '',
    dateTime = '',
    vehicle = '',
    passengerCount = 0,
    passengers = [],
    ratingReceived = 0,
    status = 'completed',
  } = {}) {
    this.id = id;
    this.origin = origin;
    this.destination = destination;
    this.dateTime = dateTime;
    this.vehicle = vehicle;
    this.passengerCount = passengerCount;
    this.passengers = passengers;
    this.ratingReceived = ratingReceived;
    this.status = status;
  }
}
