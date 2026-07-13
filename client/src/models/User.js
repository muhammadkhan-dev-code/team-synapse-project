/**
 * User Model
 * Represents a user (student/faculty) on the UniRideSync platform.
 */
export class User {
  constructor({
    id = '',
    name = '',
    email = '',
    avatar = '',
    rating = 0,
    totalReviews = 0,
    totalRides = 0,
    badges = [],
    isVerified = false,
    verifiedType = 'Student', // 'Student' | 'Faculty' | 'Staff'
    major = '',
    year = '',
    bio = '',
    co2Saved = 0,
    routesCount = 0,
    vehicle = null,
  } = {}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.rating = rating;
    this.totalReviews = totalReviews;
    this.totalRides = totalRides;
    this.badges = badges;
    this.isVerified = isVerified;
    this.verifiedType = verifiedType;
    this.major = major;
    this.year = year;
    this.bio = bio;
    this.co2Saved = co2Saved;
    this.routesCount = routesCount;
    this.vehicle = vehicle;
  }
}

/**
 * Vehicle Model
 * Represents a driver's vehicle details.
 */
export class Vehicle {
  constructor({
    make = '',
    model = '',
    year = '',
    color = '',
    licensePlate = '',
  } = {}) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.color = color;
    this.licensePlate = licensePlate;
  }

  get displayName() {
    return `${this.make} ${this.model} (${this.year})`;
  }
}
