import { db } from "./config";
import {
  Timestamp,
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export const addDocument = async (collectionName, data) => {
  await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: Timestamp.fromDate(new Date()),
  });
};

export const updateDocument = async (collectionName, data, id) => {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    createdAt: Timestamp.fromDate(new Date()),
  });
};

export const getDocuments = async (collectionName, condition) => {
  const docsRef = collection(db, collectionName);

  let q;
  if (condition) {
    q = query(
      docsRef,
      where(condition.fieldName, condition.operator, condition.compareValue),
      orderBy("createdAt")
    );
  } else {
    q = query(docsRef, orderBy("createdAt"));
  }
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return data;
};

export const setDocument = async (collectionName, data, docId) => {
  await setDoc(doc(db, collectionName, docId), {
    ...data,
    id: docId,
    createdAt: Timestamp.fromDate(new Date()),
  });
};

export const deleteDocument = async (collectionName, docId) => {
  await deleteDoc(doc(db, collectionName, docId));
};
