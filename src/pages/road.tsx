import React, { useEffect, useState } from 'react';
import axios from 'axios';
interface road {
  id: number; // Add an ID for tracking items
  name: string;
  description: string;
}

function Roads() {

    const [Road, setRoad] = useState<road[]>([]);
    
      useEffect(() => {
        console.log("Road", Road);
      }, [Road]);
      const [newroadName, setNewroadName] = useState('');
      const [newDescription, setNewDescription] = useState('');
      const [searchQuery, setSearchQuery] = useState(''); // State for search query
      const [searchType, setSearchType] = useState('name'); // State for search type (id or name)
      const [filteredroad, setFilteredroad] = useState<road[]>(Road);
      const [editingroadId, setEditingroadId] = useState<number | null>(null);
      const [editedroad, setEditedroad] = useState<road | null>(null);
      const [showMessage, setShowMessage] = useState(false); // State for message box
      const[editMessage,setEditMessage]=useState(false);//state for edit message box
      const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for delete confirmation
      const [roadToDelete, setroadToDelete] = useState<number | null>(null); // Track building to delete
    
       const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
          const { name, value } = e.target;
          switch (name) {
            case 'newroadName':
              setNewroadName(value);
              break;
            case 'newDescription':
              setNewDescription(value);
              break;
            case 'searchQuery': // Handle search query input
              setSearchQuery(value);
              break;
            case 'searchType': // Handle search type selection
              setSearchType(value);
              break;
            default:
              break;
          }
        };
        const handleSearch = () => {
    const filtered = Road.filter((roads) => {
      if (searchType === 'name') {
        return roads.name.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (searchType === 'id') {
        return roads.id.toString().includes(searchQuery);
      }
      return false;
    });
    setFilteredroad(filtered);
  };
   const handleAddItem = async () => {
    if (newroadName.trim() && newDescription.trim()) {
      const newroad: road = {
        id: Date.now(), // Generate a unique ID
        name: newroadName.trim(),
        description: newDescription.trim(),
      };
      setRoad([...Road, newroad]);
      setFilteredroad([...Road, newroad]); // Update filtered list
      setNewroadName('');
      setNewDescription('');
      setShowMessage(true); // Show the message box
 /*try {
        console.log("object", newroad)
       const response = await axios.post(
          'http://localhost:3000/api/normgroup/add',
          { newroad },
          { withCredentials: true }
        );

        if (response.data.success) {
          // console.log("response.data.data", response.data.data);

        } else {
          // form.reset({});
          
        }
      } catch (error) {
        console.error("Error fetching person:", error);
      }*/

     
      // Hide the message box after 3 seconds
      setTimeout(() => setShowMessage(false), 3000);
    }
  };
   const handleEdit = (roads: road) => {
     setEditingroadId(roads.id);
    setEditedroad({ ...roads }); // Create a copy for editing

  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedroad) {
      setEditedroad({ ...editedroad, [name]: value });
    }
  };

  const handleUpdate = async ()  => {
    if (editedroad) {
      const updatedroad = Road.map((roads) =>
        roads.id === editedroad.id ? { ...editedroad} : roads
      );
      setRoad(updatedroad);
      setFilteredroad(updatedroad); // Update filtered list
      setEditingroadId(null);
      setEditedroad(null);
      setEditMessage(true); //show the edit message box
 
      
      // Hide the message box after 3 seconds
      setTimeout(() => setEditMessage(false), 3000);
    }
  };
   const handleDelete = (id: number) => {
    const updatedroad = Road.filter((roads) => roads.id !== id);
    setRoad(updatedroad);
    setFilteredroad(updatedroad); // Update filtered list
  };

  const handleDeleteClick = (id: number) => {
    setroadToDelete(id); // Set the building to delete
    setShowDeleteConfirmation(true); // Show the confirmation box
  };

  const confirmDelete = () => {
    if (roadToDelete !== null) {
      const updatedroad = Road.filter((roads) => roads.id !== roadToDelete);
      setRoad(updatedroad);
      setFilteredroad(updatedroad); // Update filtered list
      setShowDeleteConfirmation(false); // Hide the confirmation box
      setroadToDelete(null); // Reset the building to delete
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false); // Hide the confirmation box
    setroadToDelete(null); // Reset the building to delete
  };

  return (
    <div  className="ml-[20%] mt-[10%] h-screen">
      <h1 className="text-3xl font-bold mb-6">Norm Group</h1>

      {/* Search Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Search Norm Group</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            name="searchType"
            value={searchType}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/6"
          >
            <option value="name">Name</option>
            <option value="id">ID</option>
          </select>
          <input
            type="text"
            name="searchQuery"
            placeholder={`Search by ${searchType}`}
            value={searchQuery}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>
  {/* Delete Confirmation Box */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-blue-900 p-6 rounded shadow-lg text-white">
            <p className="mb-4">Are you sure you want to delete this?</p>
            <div className="flex justify-end">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Norm Group Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Norm Group</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="newroadName"
            placeholder="road name"
            value={newroadName}
            onChange={handleInputChange}
            className="border p-2 rounded w-40% md:w-1/3"
          />
          <input
            type="text"
            name="newDescription"
            placeholder="Description"
            value={newDescription}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <button
            onClick={handleAddItem}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Building
          </button>
        </div>
      </div>
       {/* Message Box */}
       {showMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
           added successfully!
        </div>
      )}
      {/* Norm Group List Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Norm Group List</h2>
         {/* Edit Success Message */}
  {editMessage && (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
      Update successful!
    </div>
  )}
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Description</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredroad.map((roads) => (
              <tr key={roads.id}>
                {editingroadId === roads.id && editedroad ? (
                  <>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="name"
                        value={editedroad.name}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="description"
                        value={editedroad.description}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={handleUpdate}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Update
                      </button>
                      
                    </td>
                    
                  </>
                ) : (
                  <>
                    <td className="border px-4 py-2">{roads.name}</td>
                    <td className="border px-4 py-2">{roads.description}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEdit(roads)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(roads.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Roads
