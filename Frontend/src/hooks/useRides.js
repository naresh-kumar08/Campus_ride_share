import { useCallback, useEffect, useState } from "react";
import api from "../api";

export default function useRides(initialFilters = {}) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const fetchRides = useCallback(
    async (overrideFilters) => {
      setLoading(true);
      try {
        const activeFilters = overrideFilters ?? filters;
        const { data } = await api.get("/rides", {
          params: activeFilters,
        });
        setRides(data.data);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  return {
    rides,
    loading,
    filters,
    setFilters,
    refresh: fetchRides,
  };
}


