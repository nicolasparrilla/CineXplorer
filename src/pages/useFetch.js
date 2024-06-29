import { useState, useEffect } from 'react';

const useFetch = (url, setData) => {
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.error('Error al realizar la solicitud:', error);
      });
  }, [url, setData]);
};

export default useFetch;
