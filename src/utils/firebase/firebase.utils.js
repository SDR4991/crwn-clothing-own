import {initializeApp} from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
  } from 'firebase/auth';
import {getFirestore, doc, getDoc, setDoc,collection,writeBatch,query,getDocs} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC04y-fA5--IGCDXTJ7gWmBO3e6mGLTtbw",
    authDomain: "crwn-clothing-d7349.firebaseapp.com",
    projectId: "crwn-clothing-d7349",
    storageBucket: "crwn-clothing-d7349.appspot.com",
    messagingSenderId: "424332832043",
    appId: "1:424332832043:web:7e11a80ecad9dcc42a296e"
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

  const provider = new GoogleAuthProvider();
  
  provider.setCustomParameters({
    prompt:"select_account"
  });

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth,provider);

export const db = getFirestore();

// Add collections & documents to FireBase DB if it`s not exist or we need to do so
export const addCollectionAndDocuments = async (collectionKey,objectToAdd) => {
  const collectionRef = collection(db,collectionKey);
  const batch = writeBatch(db);

  objectToAdd.forEach((object)=>{
    const docRef = doc(collectionRef,object.title.toLowerCase());
    batch.set(docRef,object);
  });

  await batch.commit();
  
  console.log('done');
};

// Pull out required data from FireBase DB
export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db,'categories');
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const categoryMap = querySnapshot.docs.reduce((acc,docSnapshot)=>{
    const {title, items} = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  },{})

  return categoryMap;

};

export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) =>{
  if(!userAuth) return;

  const userDocRef = doc(db,'users',userAuth.uid);

  console.log(userDocRef);

  const userSnapshot = await getDoc(userDocRef);

  console.log(userSnapshot);
  console.log(userSnapshot.exists());

  
  if(!userSnapshot.exists()){
    const {displayName,email} = userAuth;
    const createdAt = new Date();

    try{
      await setDoc(userDocRef,{
        displayName,
        email,
        createdAt,
        ...additionalInformation
      })
    }catch(e){
      console.log("Error to create user")
    }
  }

  return userDocRef;
}

export const createAuthUserWithEmailAndPassword = async (email,password) =>{
  if(!email || !password) return;

  return await createUserWithEmailAndPassword(auth,email,password);
}

export const signInAuthUserWithEmailAndPassword = async (email,password) =>{
  if(!email || !password) return;

  return await signInWithEmailAndPassword(auth,email,password);
}

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth,callback);