/**
 * useRides Controller Hook
 * Manages ride-related state and operations.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  getAvailableRides,
  getRideById,
  createRide,
  requestToJoin,
  acceptParticipant,
  declineParticipant,
  getMyRides,
  getActiveRide,
} from '../services/rideService';

/**
 * Hook for fetching and filtering available rides.
 */
export function useRides(initialFilters = {}) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchRides = useCallback(async (newFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAvailableRides(newFilters);
      setRides(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchRides(); }, []);

  const search = (newFilters) => {
    setFilters(newFilters);
    fetchRides(newFilters);
  };

  const joinRide = async (rideId) => {
    try {
      const result = await requestToJoin(rideId);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { rides, loading, error, search, joinRide, refetch: fetchRides };
}

/**
 * Hook for a single ride detail with participant management.
 */
export function useRideDetail(rideId) {
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!rideId) return;
    setLoading(true);
    getRideById(rideId)
      .then(setRide)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [rideId]);

  const accept = async (userId) => {
    setActionLoading(true);
    try {
      await acceptParticipant(rideId, userId);
      setRide((prev) => ({
        ...prev,
        pendingRequests: prev.pendingRequests.filter((p) => p.user.id !== userId),
        participants: [...prev.participants, prev.pendingRequests.find((p) => p.user.id === userId)].filter(Boolean),
      }));
    } finally {
      setActionLoading(false);
    }
  };

  const decline = async (userId) => {
    setActionLoading(true);
    try {
      await declineParticipant(rideId, userId);
      setRide((prev) => ({
        ...prev,
        pendingRequests: prev.pendingRequests.filter((p) => p.user.id !== userId),
      }));
    } finally {
      setActionLoading(false);
    }
  };

  return { ride, loading, error, accept, decline, actionLoading };
}

/**
 * Hook for creating a new ride.
 */
export function useCreateRide() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const postRide = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const ride = await createRide(data);
      setSuccess(true);
      return ride;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postRide, loading, error, success };
}

/**
 * Hook for the user's own rides (offered + taken).
 */
export function useMyRides() {
  const [offered, setOffered] = useState([]);
  const [taken, setTaken] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyRides()
      .then(({ offered, taken }) => { setOffered(offered); setTaken(taken); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { offered, taken, loading, error };
}
