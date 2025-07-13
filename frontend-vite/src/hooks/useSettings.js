import { useEffect, useState } from 'react';
import axios from 'axios';

export const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // fetch from new public endpoint
      const { data } = await axios.get('/api/public/settings');
        setSettings(data);
      } catch (error) {
        console.warn('Public settings not available. Falling back to empty settings.');
        setSettings({});
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};
