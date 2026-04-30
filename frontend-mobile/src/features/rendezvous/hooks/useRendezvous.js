import { useState, useEffect } from 'react';
import rendezvousApi from '../../../api/rendezvous.api';
import useI18n from '../../../i18n/useI18n';

const useRendezvous = () => {
  const { t } = useI18n();
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
      setError(err.response?.data?.message || t('errors.rendezvousLoad'));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchRendezvous();
  }, [t]);

  return { rendezvous, isLoading, error, refetch: fetchRendezvous };
};

export default useRendezvous;
