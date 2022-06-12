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
export const generateKeywords = (displayName) => {
  // liet ke tat cac hoan vi. vd: name = ["David", "Van", "Teo"]
  // => ["David", "Van", "Teo"], ["David", "Teo", "Van"], ["Teo", "David", "Van"],...
  const name = displayName.split(" ").filter((word) => word);

  const length = name.length;
  let flagArray = [];
  let result = [];
  let stringArray = [];

  /**
   * khoi tao mang flag false
   * dung de danh dau xem gia tri
   * tai vi tri nay da duoc su dung
   * hay chua
   **/
  for (let i = 0; i < length; i++) {
    flagArray[i] = false;
  }

  const createKeywords = (name) => {
    const arrName = [];
    let curName = "";
    name.split("").forEach((letter) => {
      curName += letter;
      arrName.push(curName);
    });
    return arrName;
  };

  function findPermutation(k) {
    for (let i = 0; i < length; i++) {
      if (!flagArray[i]) {
        flagArray[i] = true;
        result[k] = name[i];

        if (k === length - 1) {
          stringArray.push(result.join(" "));
        }

        findPermutation(k + 1);
        flagArray[i] = false;
      }
    }
  }

  findPermutation(0);

  const keywords = stringArray.reduce((acc, cur) => {
    const words = createKeywords(cur);
    return [...acc, ...words];
  }, []);

  return keywords;
};
