/**
 * useProfile Controller Hook
 * Manages user profile state and operations.
 */
import { useState, useEffect } from 'react';
import { getMyProfile, updateProfile } from '../services/userService';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async (data) => {
    setSaving(true);
    try {
      const updated = await updateProfile(data);
      setProfile(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, error, saving, saveProfile };
}
