import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useState, useEffect, createContext, useContext } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyAm0ZulacnSeRzsfUe0oM0nM8peNqwrGZY",
  authDomain: "messenger-566cb.firebaseapp.com",
  projectId: "messenger-566cb",
  storageBucket: "messenger-566cb.appspot.com",
  messagingSenderId: "1068689170579",
  appId: "1:1068689170579:web:a8f4d5d444f2105e5a2d66"
};

const app = initializeApp(firebaseConfig);
const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);
const auth = getAuth(app);
const firestore = getFirestore(app)
export const googleProvider = new GoogleAuthProvider();


export const signupUserWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
}

export const signinUserWithEmailAndPassword = async (email, password) => {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password)
    // notifySignin();
    return credentials;
  } catch (error) {
    throw error
  }
}

const signupWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch {
    console.error("error");
  }
}


export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) { setUser(user) }
      else { setUser(null); }
    })
  }, [])

  const addContact = async (name, email) => {
    try {
      // Get a reference to the contacts collection
      const contactsRef = collection(firestore, 'contacts');
  
      // Query for the contact with the specified email
      const contactQuery = query(contactsRef, where("email", "==", email));
      const contactSnap = await getDocs(contactQuery);
  
      if (contactSnap.empty) {
        // If no contact exists, add a new contact with 'addedBy' initialized
        await addDoc(contactsRef, {
          name,
          email,
          addedBy: [user.email] // Initialize 'addedBy' array with the email of the user adding the contact
        });
        console.log("Contact added successfully.");
      } else {
        // If contact exists, update the 'addedBy' array
        contactSnap.forEach(async (doc) => {
          const contactDocRef = doc.ref;
          const contactData = doc.data();
  
          if (!contactData.addedBy.includes([])) {
            // Update the 'addedBy' array by pushing the new email
            await updateDoc(contactDocRef, {
              addedBy: [...contactData.addedBy, user.email] // Push the new email into the existing array
            });
            console.log("Contact updated successfully.");
          } else {
            console.log("User has already added this contact.");
          }
        });
      }
    } catch (error) {
      console.error("Error adding or updating contact: ", error);
    }
  };
  

  const fetchContacts = async (userEmail) => {

    if(!userEmail){
      console.log("No contacts")
      return [];
    }
    try {
      // Define the query to find contacts where 'addedBy' contains the user's email
      const contactsQuery = query(
        collection(firestore, 'contacts'),
        where("addedBy", "array-contains", userEmail)
      );
  
      // Execute the query
      const snap = await getDocs(contactsQuery);
  
      // Map over the results and extract the contact data
      const contacts = snap.docs.map(doc => doc.data());
  
      return contacts;
    } catch (error) {
      console.error("Error fetching contacts: ", error);
      return [];
    }
  }

  const getContactByEmail = async (email) => {
    try {
      // Create a reference to the contacts collection
      const contactsRef = collection(firestore, 'contacts');

      // Create a query against the collection
      const q = query(contactsRef, where("email", "==", email));

      // Execute the query
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assuming there is only one document with the given email
        const contact = querySnapshot.docs[0].data();
        // console.log("Contact: ", contact);
        return contact;
      } else {
        console.log("No matching documents.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching contact: ", error);
      return null;
    }
  };

  const createChatRoom = async (recieverEmail) => {
    try {
      if (!user || !user.email) {
        // console.error("User is not authenticated or email is missing.");
        return;
      }
      const chatRoomsRef = collection(firestore, "chatRooms");
      const q = query(chatRoomsRef, where("participants", "array-contains", user.email));
      const querySnapshot = await getDocs(q);
      let chatRoomExists = false;
      querySnapshot.forEach((doc) => {
        const chatRoom = doc.data();
        if (chatRoom.participants.includes(recieverEmail)) {
          chatRoomExists = true;
        }
      });
      if (chatRoomExists) {
        // console.log("Chat room already exists with these participants.");
      } else {
        const chatId = uuidv4();

        const now = new Date();
        const formattedDate = `${now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}, ${now.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}`;

        await setDoc(doc(firestore, "chatRooms", chatId), {
          chatId: chatId,
          participants: [user.email, recieverEmail],
          createdAt: formattedDate
        });

        // console.log("Chat room created with ID: ", chatId);
      }
    } catch (e) {
      console.error("Error creating chat room: ", e);
    }
  };


  const fetchChatRoomData = async (recieverEmail) => {
    if (!user || !user.email) {
      return;
    }
    const chatRoomsRef = collection(firestore, "chatRooms");
    const q = query(chatRoomsRef, where("participants", "array-contains", user.email));

    try {
      const querySnapshot = await getDocs(q);
      const targetChatRoom = querySnapshot.docs
        .map(doc => doc.data())
        .find(chatRoom => chatRoom.participants.includes(recieverEmail));

      if (targetChatRoom) {
        console.log("Target chat room:", targetChatRoom);
        return targetChatRoom;
      } else {
        console.log("No matching chat room found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching chat room data:", error);
      return null;
    }
  };

  const sendMessage = async (chatId, content) => {
    try {
      const messageID = uuidv4();

      const now = new Date();
      const formattedDate = `${now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}, ${now.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`;

      const messageRef = collection(firestore, 'messages');
      await addDoc(messageRef, {
        messageId: messageID,
        chatId: chatId,
        email: user.email,
        content: content,
        sentAt: formattedDate,
      });
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };


  const fetchMessagesData = (chatId, callback) => {
    if (!chatId) {
      console.error("Chat ID is undefined. Cannot fetch messages.");
      return;
    }
  
    try {
      const messagesRef = collection(firestore, "messages");
      const q = query(messagesRef, where("chatId", "==", chatId));
  
      // Real-time listener with onSnapshot
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() });
        });
  
        messages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
  
        callback(messages);
      });
  
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };
  

  const logOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      toast.success("successfully logged out")
      console.log(user.email)
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  return <FirebaseContext.Provider value={{ user, createChatRoom, signinUserWithEmailAndPassword, logOut, fetchMessagesData, fetchChatRoomData, fetchContacts, sendMessage, getContactByEmail, signupUserWithEmailAndPassword, addContact, signupWithGoogle }}>{props.children}</FirebaseContext.Provider>
}