import PropTypes from 'prop-types';
import React, { createContext, useCallback, useContext, useEffect, useState, useMemo } from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const getData = useCallback(async () => {
    try {
      const loadedData = await api.loadData();
      setData(loadedData);
    } catch (err) {
      setError(err);
    }
  }, []);
  
  useEffect(() => {
    if (data) return;
    getData();
  }, [data, getData]);
  
  const value = useMemo(() => ({ data, error }), [data, error]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;