import { useEffect, useState } from "react";
import { PAGINATION } from "@/config/constants";

interface UseEntitySearchProps<T extends { 
  search: string; 
  page: number 
}> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export function useEntitySearch<T extends {
  search: string;
  page: number;
}>({
  params,
  setParams,
  debounceMs = 500
}: UseEntitySearchProps<T>) {


  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    if (localSearch === "" && params.search !== "") {
      setParams({
        ...params,
        search: "",
        page: PAGINATION.DEFAULT_PAGE,
      });
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch,
          page: PAGINATION.DEFAULT_PAGE,
        })
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, params, setParams, debounceMs]);

  useEffect(() => {
    setLocalSearch(params.search)
  }, [params.search]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
};


// this whole function work is to handle the search input and debounce it, so that we don't make a request on every keystroke. It also resets the page to 1 when the search query changes.

// and its only changes the NUQS params, and NUQS params are used in the server router to fetch the data, so when the params change, the data will be refetched with the new params.