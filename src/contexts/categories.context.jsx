import { createContext, useState, useEffect } from "react";

// import { getCategoriesAndDocuments } from '../utils/firebase/firebase.utils';

import { gql, useQuery } from "@apollo/client";

export const CategoriesContext = createContext({
  categoriesMap: {},
});

// naming query is optional , you can also just do query{} instead of query GetCollections {}
const COLLECTIONS = gql`
  query GetCollections {
    collections {
      id
      title
      items {
        id
        name
        price
        imageUrl
      }
    }
  }
`;

export const CategoriesProvider = ({ children }) => {
  const { loading, error, data } = useQuery(COLLECTIONS);
  const [categoriesMap, setCategoriesMap] = useState({});

  // console.log("loading", loading);
  // console.log("data", data);

  useEffect(() => {
    if (data) {
      const { collections } = data;
      const collectionsMap = collections.reduce((acc, collection) => {
        const { title, items } = collection;
        acc[title.toLowerCase()] = items;
        return acc;
      }, {});

      setCategoriesMap(collectionsMap);
    }
  }, [data]);

  const value = { categoriesMap, loading };
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
