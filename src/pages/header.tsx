import axios from 'axios';
import React, { useEffect, useState } from 'react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


interface norms {
  id: number; // Add an ID for tracking items
  title: string;
  description: string;
  unit:string;
  remark:string;
  source:string;
}

const header = () => {

  const [Norms, setNorms] = useState<norms[]>([]);
  
    useEffect(() => {
      console.log("Buildings", Norms);
    }, [Norms]);

     const [newtitle, setNewtitle] = useState('');
     const [newdescription, setNewdescription] = useState('');
      const [newunit, setNewunit] = useState('');
      const [newremark, setNewremark] = useState('');
       const [newsource, setNewsource] = useState('');

    const [searchQuery, setSearchQuery] = useState(''); // State for search query
      const [searchType, setSearchType] = useState('title'); // State for search type (id or name)
      const [filterednorms, setFilterednorms] = useState<norms[]>(Norms);
      const [editingnormsId, setEditingnormsId] = useState<number | null>(null);
      const [editednorms, setEditednorms] = useState<norms | null>(null);
      const [showMessage, setShowMessage] = useState(false); // State for message box
      const[editMessage,setEditMessage]=useState(false);//state for edit message box
      const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for delete confirmation
      const [normsToDelete, setnormsToDelete] = useState<number | null>(null); // Track building to delete
    const handleDownloadPDF = () => {
      const doc = new jsPDF();
    
      // Title
      doc.setFontSize(16);
      doc.text("Norms List", 14, 15);
    
      // Prepare table rows from filteredBuildings data
      const rows = filterednorms.map((norm) => [
        norm.id || "-",
        norm.title || "-",
        norm.description || "-",
        norm.unit || "-",
        norm.remark || "-",
        norm.source || "-", 
      ]);
    
      // Insert table with headers
      autoTable(doc, {
        head: [["ID", "Title", "Description"," Unit", "Remark", "Source"]],
        body: rows,
        startY: 22,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] }, // optional: blue header
        styles: { fontSize: 10 },
      });
    
      // Save the PDF
      doc.save("norm list.pdf");
    };
    
       const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
          const { name, value } = e.target;
          switch (name) {
            case 'newtitle':
              setNewtitle(value);
              break;
            case 'newdescription':
              setNewdescription(value);
              break;
              case 'newunit':
              setNewunit(value);
              break;
              case 'newremark':
              setNewremark(value);
              break;
              case 'newsource':
              setNewsource(value);
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
    const filtered = Norms.filter((norms) => {
      if (searchType === 'title') {
        return norms.title.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (searchType === 'id') {
        return norms.id.toString().includes(searchQuery);
      }
      return false;
    });
    setFilterednorms(filtered);
  };

   // ...existing code...
const handleAddItem = async () => {
  if (
    newtitle.trim() &&
    newdescription.trim() &&
    newunit.trim() &&
    newremark.trim() &&
    newsource.trim()
  ) {
    const newnorms: norms = {
      id: Date.now(), // Generate a unique ID
      title: newtitle.trim(),
      description: newdescription.trim(),
      unit: newunit.trim(),
      remark: newremark.trim(),
      source: newsource.trim(),
    };
    setNorms([...Norms, newnorms]);
    setFilterednorms([...Norms, newnorms]); // Update filtered list
    setNewtitle('');
    setNewdescription('');
    setNewunit('');
    setNewremark('');
    setNewsource('');
    setShowMessage(true); // Show the message box
try {
        console.log("object", newnorms)
       const response = await axios.post(
          'http://localhost:3000/api/norms/add',
          { newnorms },
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
const handleDelete = (id: number) => {
    const updatednorms = Norms.filter((norms) => norms.id !== id);
    setNorms(updatednorms);
    setFilterednorms(updatednorms); // Update filtered list
  };

  const handleDeleteClick = (id: number) => {
    setnormsToDelete(id); // Set the building to delete
    setShowDeleteConfirmation(true); // Show the confirmation box
  };

    const handleEdit = (norms: norms) => {
      setEditingnormsId(norms.id);
      setEditednorms({ ...norms }); // Create a copy for editing
  
    };
  
    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { title, value } = e.target;
      if (editednorms) {
        setEditednorms({ ...editednorms, [title]: value });
      }
    };

    const handleUpdate = async ()  => {
    if (editednorms) {
      const updatednorms = Norms.map((norms) =>
        norms.id === editednorms.id ? { ...editednorms } : norms
      );
      setNorms(updatednorms);
      setFilterednorms(updatednorms); // Update filtered list
      setEditingnormsId(null);
      setEditednorms(null);
      setEditMessage(true); //show the edit message box

      
      // Hide the message box after 3 seconds
      setTimeout(() => setEditMessage(false), 3000);
    }
  };
 const confirmDelete = () => {
    if (normsToDelete !== null) {
      const updatednorms = Norms.filter((norms) => norms.id !== normsToDelete);
      setNorms(updatednorms);
      setFilterednorms(updatednorms); // Update filtered list
      setShowDeleteConfirmation(false); // Hide the confirmation box
      setnormsToDelete(null); // Reset the building to delete
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false); // Hide the confirmation box
    setnormsToDelete(null); // Reset the building to delete
  };
   useEffect(() => {
  const fetchnormsList = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/norms/get-all-data',{
        withCredentials: true
      }); 

      const data = await response.data.data;
      setNorms(data);
      setFilterednorms(data);
      console.log("Norm Details list:", data);
    } catch (error) {
      console.error("Failed to fetch norm details:", error);
    }
  };

  fetchnormsList();
}, []);

  
  return (
   <div className="ml-[20%] mt-[10%] h-screen">
      <h1 className="text-3xl font-bold mb-6">Norm Header</h1>
  {/* Search Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Search Norms</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            name="searchType"
            value={searchType}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/6"
          >
            <option value="title">title</option>
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
        <h2 className="text-xl font-semibold mb-2">Add New Norms</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="newtitle"
            placeholder="title"
            value={newtitle}
            onChange={handleInputChange}
            className="border p-2 rounded w-40% md:w-1/3"
          />
          <input
            type="text"
            name="newdescription"
            placeholder="description"
            value={newdescription}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/3"
          />
            <input
            type="text"
            name="newunit"
            placeholder="unit"
            value={newunit}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/3"
          />
            <input
            type="text"
            name="newremark"
            placeholder="remark"
            value={newremark}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/3"
          />
            <input
            type="text"
            name="newsource"
            placeholder="source"
            value={newsource}
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
        <h2 className="text-xl font-semibold mb-4">Norm List</h2>
         {/* Edit Success Message */}
  {editMessage && (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
      Update successful!
    </div>
  )}
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-left">Title</th>
              <th className="border px-4 py-2 text-left">Description</th>
               <th className="border px-4 py-2 text-left">unit</th>
                <th className="border px-4 py-2 text-left">Remark</th>
                 <th className="border px-4 py-2 text-left">Source</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterednorms.map((norms) => (
              <tr key={norms.id}>
                {editingnormsId === norms.id && editednorms ? (
                  <>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="title"
                        value={editednorms.title}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="description"
                        value={editednorms.description}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="unit"
                        value={editednorms.unit}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="remark"
                        value={editednorms.remark}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                      <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="source"
                        value={editednorms.source}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                    </td>
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
                    <td className="border px-4 py-2">{norms.title}</td>
                    <td className="border px-4 py-2">{norms.description}</td>
                    <td className="border px-4 py-2">{norms.unit}</td>
                    <td className="border px-4 py-2">{norms.remark}</td>
                    <td className="border px-4 py-2">{norms.source}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEdit(norms)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(norms.id)}
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

export default header
