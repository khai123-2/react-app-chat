import React, { useState } from "react";
import { db } from "../firebase/config";
import {
  query,
  where,
  orderBy,
  onSnapshot,
  collection,
} from "firebase/firestore";
const useFirestore = (collectionTable, condition) => {
  const [documents, setDocuments] = useState([]);
  React.useEffect(() => {
    const usersCollectionRef = collection(db, collectionTable);
    let q;
    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        setDocuments([]);
        return;
      }
      q = query(
        usersCollectionRef,
        where(condition.fieldName, condition.operator, condition.compareValue),
        orderBy("createdAt")
      );
    } else {
      q = query(usersCollectionRef, orderBy("createdAt"));
    }
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setDocuments(documents);
    });

    return unsubscribe;
  }, [collectionTable, condition]);

  return documents;
};

export default useFirestore;
