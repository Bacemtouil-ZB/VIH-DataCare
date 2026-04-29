import { useState, useEffect } from 'react';
import rendezvousApi from '../../../api/rendezvous.api';

const useRendezvous = () => {
  const [rendezvous, setRendezvous] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRendezvous = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await rendezvousApi.getRendezvous();
      setRendezvous(data.rendezvous);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchRendezvous();
  }, []);

  return { rendezvous, isLoading, error, refetch: fetchRendezvous };
};

export default useRendezvous;