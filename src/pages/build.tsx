import axios from "axios";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



interface buildings {
  id: number; // Add an ID for tracking items
 // norm_group_id: number; // Add an ID for tracking items
  name: string;
  // group_name: string;
  description: string;
}

function Build() {
  // const [Buildings, setBuildings] = useState<buildings[]>([
  //   { id: 1, name: 'Building A', description: 'Description A' },
  // ]);

  const [Buildings, setBuildings] = useState<buildings[]>([]);

  useEffect(() => {
    console.log("Buildings", buildingToDelete);
  }, [Buildings]);
  const [showModal, setShowModal] = useState(false);
  const [newbuildName, setNewbuildName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [searchType, setSearchType] = useState('name'); // State for search type (id or name)
  const [filteredBuildings, setFilteredBuildings] = useState<buildings[]>(Buildings);
  const [editingBuildingId, setEditingBuildingId] = useState<number | null>(null);
  const [editedBuilding, setEditedBuilding] = useState<buildings | null>(null);
  const [showMessage, setShowMessage] = useState(false); // State for message box
  const [editMessage, setEditMessage] = useState(false); //state for edit message box
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for delete confirmation
  const [buildingToDelete, setBuildingToDelete] = useState<number | null>(null); // Track building to delete
  const [updatenormgroup, setUpdatenormgroup] = useState<buildings | null>(null); // Track building to update
  
   const handleSubmit = () => {
    alert("Form submitted!");
    setShowModal(false);
  };
//  const showpopup = ({ id, name, description }:buildings) => {
  const showpopup = ( { id, name, description }: buildings) => {
  
   setUpdatenormgroup({ id, name, description });
   setShowModal(true);
 };

const handleDownloadPDF = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text("Norm Group List", 14, 15);

  // Prepare table rows from filteredBuildings data
  const rows = filteredBuildings.map((normgroup) => [
    normgroup.id || "-",
    normgroup.name || "-",
    normgroup.description || "-",
  ]);

  // Insert table with headers
  autoTable(doc, {
    head: [["ID", "Name", "Description"]],
    body: rows,
    startY: 22,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185] }, // optional: blue header
    styles: { fontSize: 10 },
  });

  // Save the PDF
  doc.save("norm-group-list.pdf");
};


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "newbuildName":
        setNewbuildName(value);
        break;
      case "newDescription":
        setNewDescription(value);
        break;
      case "searchQuery": // Handle search query input
        setSearchQuery(value);
        break;
      case "searchType": // Handle search type selection
        setSearchType(value);
        break;
      default:
        break;
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/normgroup/:aid",
        {
          params: {
            [searchType]: searchQuery,
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setFilteredBuildings(response.data.data);
      } else {
        setFilteredBuildings([]);
      }
    } catch (error) {
      console.error("Error searching normgroups:", error);
      setFilteredBuildings([]);
    }
  };
  const handleAddItem = async () => {
    if (newbuildName.trim() && newDescription.trim()) {
      const newBuilding: buildings = {
  id: Date.now(),
  //norm_group_id: 0, // or get from user input
  name: newbuildName.trim(),
  
  description: newDescription.trim(),
};
      setBuildings([...Buildings, newBuilding]);
      setFilteredBuildings([...Buildings, newBuilding]); // Update filtered list
      setNewbuildName("");
      setNewDescription("");
      setShowMessage(true); // Show the message box

      try {
        console.log("object", newBuilding);
        const response = await axios.post(
          "http://localhost:3000/api/normgroup/add",
          { newBuilding },
          { withCredentials: true }
        );

        if (response.data.success) {
          // console.log("response.data.data", response.data.data);
        } else {
          // form.reset({});
        }
      } catch (error) {
        console.error("Error fetching person:", error);
      }

      // Hide the message box after 3 seconds
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

//   const handleEdit = (building: buildings) => {
//     console.log("buildingqqqq", building);

//     setEditingBuildingId(building.id);
//     setEditedBuilding(building); // Directly assign the building object
//   };

//   const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (editedBuilding) {
//       setEditedBuilding({ ...editedBuilding, [name]: value });
//     }
//   };

//   const handleUpdate = async () => {
//   if (editedBuilding) {
//     try {
//       // Send only the updated building to the backend
//       const response = await axios.put(
//         `http://localhost:3000/api/normgroup/update/${editedBuilding.id}`,
//         editedBuilding,
//         { withCredentials: true }
//       );

//       if (response.data.success) {
//         // Update local state if backend update is successful
//         const updatedBuildings = Buildings.map((building) =>
//           building.id === editedBuilding.id ? { ...editedBuilding } : building
//         );
//         setBuildings(updatedBuildings);
//         setFilteredBuildings(updatedBuildings);
//         setEditingBuildingId(null);
//         setEditedBuilding(null);
//         setEditMessage(true); // Show the edit message box
//         setTimeout(() => setEditMessage(false), 3000);
//       } else {
//         alert("Update failed on server.");
//       }
//     } catch (error) {
//       console.error("Error updating building:", error);
//       alert("Error updating building.");
//     }
//   }
// };

const handleUpdate = async () => {
  if (updatenormgroup) {
    console.log("updatenormgroup", updatenormgroup);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/normgroup/update/${updatenormgroup.id}`,
        updatenormgroup,
        { withCredentials: true }
      );
      if (response.data.success) {
        // Update local state
        const updatedBuildings = Buildings.map((building) =>
          building.id === updatenormgroup.id ? { ...updatenormgroup } : building
        );
        setBuildings(updatedBuildings);
        setFilteredBuildings(updatedBuildings);
        setShowModal(false);
        setEditMessage(true);
        setTimeout(() => setEditMessage(false), 3000);
      } else {
        alert("Update failed on server.");
      }
    } catch (error) {
      console.error("Error updating norm group:", error);
      alert("Error updating norm group.");
    }
  }
};

  const handleDeleteClick = (id: number) => {
    console.log("id",id)
    
    setBuildingToDelete(id); // Set the building to delete
    setShowDeleteConfirmation(true); // Show the confirmation box
  };

  const confirmDelete = async () => {
    if (buildingToDelete !== null) {
      const updatedBuildings = Buildings.filter((building) => building.id !== buildingToDelete);
      setBuildings(updatedBuildings);
      setFilteredBuildings(updatedBuildings); // Update filtered list
      setShowDeleteConfirmation(false); // Hide the confirmation box
      try {
        console.log("object", updatedBuildings);
        console.log("editingBuildingId", editingBuildingId);
        const response = await axios.delete(
          `http://localhost:3000/api/normgroup/delete/${buildingToDelete}`,

          { withCredentials: true }
        );

        if (response.data.success) {
          // console.log("response.data.data", response.data.data);
        } else {
          // form.reset({});
        }
      } catch (error) {
        console.error("Error fetching person:", error);
      }
      setBuildingToDelete(null); // Reset the building to delete
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false); // Hide the confirmation box
    setBuildingToDelete(null); // Reset the building to delete
  };

   useEffect(() => {
  const fetchNormgroupList = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/normgroup/get-all-data',{
        withCredentials: true
      }); 

      const data = await response.data.data;
      setBuildings(data);
      setFilteredBuildings(data);
      console.log("Norm Details list:", data);
    } catch (error) {
      console.error("Failed to fetch norm details:", error);
    }
  };

  fetchNormgroupList();
}, []);

  return (
    <div className="ml-[20%] mt-[10%] h-screen">
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

      {/* ...existing code... */}

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
            name="newbuildName"
            placeholder=" Name"
            value={newbuildName}
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
            Add 
          </button>
           <button
            onClick={handleDownloadPDF}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Download PDF
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
              <th className="border px-4 py-2 text-left">ID</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Description</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
           
          </thead>
         <tbody>
  {filteredBuildings.map((normgroup) => (
    <tr key={normgroup.id}>
      {/* {editingBuildingId === building.id && editedBuilding ? ( */}
        <>
        <td className="border px-4 py-2">
            <label   className="border rounded p-1 w-full"> {normgroup.id}</label>
          </td>
          <td className="border px-4 py-2">
            <label   className="border rounded p-1 w-full"> {normgroup.name}</label>
          </td>
          <td className="border px-4 py-2">
            <label className="border rounded p-1 w-full"> {normgroup.description}</label>
          </td>
          <td className="border px-4 py-2">
            <button
              onClick={ () =>showpopup({id:normgroup.id, name:normgroup.name, description:normgroup.description,})}
              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
            >
              Update
            </button>
          </td>
        </>
      {/* ) : (
        <>
          <td className="border px-4 py-2">{building.name}</td>
          <td className="border px-4 py-2">{building.description}</td>
          <td className="border px-4 py-2">
            <button
              onClick={() => handleEdit(building)}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(building.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
            >
              Delete
            </button>
          </td>
        </>
      ) */}
      {/* } */}
    </tr>
  ))}
</tbody>
        </table>
        
      </div>
       {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Popup Title</h2>
            <p className="mb-6">This is a popup message. Do you want to proceed?</p>
            <div className="mb-4">
              <label className="block mb-2">Name:</label>
              
               <input
               hidden
                type="number"
                value={updatenormgroup?.id || ''}
                 onChange={(e) => setUpdatenormgroup({ ...(updatenormgroup ||{ id: 0, name: '', description: '' }), id: e.target.value 
                })
              }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                value={updatenormgroup?.name || ''}
                 onChange={(e) => setUpdatenormgroup({ ...(updatenormgroup ||{ id: 0, name: '', description: '' }), name: e.target.value 
                })
              }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">  
              <label className="block mb-2">Description:</label>
              <input
                type="text"
                value={updatenormgroup?.description || ''}
                 onChange={(e) =>
                setUpdatenormgroup({
                ...(updatenormgroup || { id: 0, name: '', description: '' }), description: e.target.value,
                 
    })
  }
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleUpdate}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Build;
