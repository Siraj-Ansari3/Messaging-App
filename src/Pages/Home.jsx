import React, { useEffect, useState } from 'react';
import { useFirebase } from '../Firebase';
import Navbar from '../components/Navbar';
import ViewContact from './ViewContact'; // Import ViewContact component
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const firebase = useFirebase();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null); // State for selected contact



  const handleViewContact = (contactEmail) => {
    setSelectedContact(contactEmail); // Set the selected contact
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  useEffect(() => {
    const handleFetchContacts = async () => {
      console.log(firebase.user.email)
      const contactsRef = await firebase.fetchContacts(firebase.user.email);
      setContacts(contactsRef);
      setFilteredContacts(contactsRef);
    };
    handleFetchContacts();
  }, [firebase]);

  function truncateEmail(email) {
    if (email.length > 20) {
      return email.slice(0, 20) + '...';
    }
    return email;
  }

  const navbarHeight = 65; // 65px
  const sidebarHeight = `calc(100vh - ${navbarHeight}px)`;

  return (
    <>
      <div className="">
        <Navbar onSearch={handleSearch} />
        <div className='flex flex-row flex-grow'>
          <div
            style={{ height: sidebarHeight }}
            className="w-72 bg-white p-3 rounded-md shadow-md flex flex-col transition-width duration-300"
          >
            <h1 className="text-3xl font-bold mb-6">Contacts</h1>
            <div className="flex-grow h-full w-full overflow-y-auto">
              <ul className="space-y-3">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <li
                      key={contact.email}
                      className="border-b border-gray-300 py-2 flex items-center cursor-pointer hover:bg-gray-100"
                      onClick={() => handleViewContact(contact.email)}
                    >
                      <div className="flex-grow">
                        <p><strong>Name:</strong> {contact.name}</p>
                        <p><strong>Email:</strong> {truncateEmail(contact.email)}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No contacts found.</p>
                )}
              </ul>
            </div>
          </div>
          <div className="flex-grow">
            {selectedContact ? (
              <ViewContact contactEmail={selectedContact} />
            ) : (
              <div className="p-6">
                <p>Select a contact to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
