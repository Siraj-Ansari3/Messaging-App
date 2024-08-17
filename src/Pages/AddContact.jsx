import React, { useState } from 'react'
import { useFirebase } from '../Firebase'

const AddContact = () => {
    const firebase = useFirebase();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const handleAddContact = async ( e ) => {
        e.preventDefault();
        try {
            await firebase.addContact(name, email);
            alert("success")
        } catch (error) {
            alert("error adding contact: " + error.message)
            console("error adding contact: " + error.message)
        }
    }
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <h1 className="text-3xl font-bold mb-6">Add Contact</h1>
            <form onSubmit={handleAddContact} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Contact
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddContact
