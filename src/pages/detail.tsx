//import { parse } from 'postcss';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { parse } from 'postcss';
interface Detail {
  normheaderid:number;
   detailid: number; // Add an ID for tracking items
   resourcetype: string;
   resourceid: number;
   unit:string;
   quantity:number;
   wastage:number;
   unitprice:number
   amount:number
}

function detail(){

   const [detail, setdetail] = useState<Detail[]>([]);
  
    useEffect(() => {
      console.log("detail", detail);
    }, [detail]);
const[newnormheaderid,setNewnormheaderid]=useState('');
    const [newresourcetype, setNewresourcetype] = useState('');
      const [newresourceid, setNewresourceid] = useState('');
      const [newunit, setNewunit] = useState('');
      const [newquantity, setNewquantity] = useState('');
      const [newwastage, setNewwastage] = useState('');
      const [newunitprice, setNewunitprice] = useState('');
       const [newamount, setNewamount] = useState('');
      const [searchQuery, setSearchQuery] = useState(''); // State for search query
      const [searchType, setSearchType] = useState('type'); // State for search type (id or name)
      const [filtereddetail, setFiltereddetail] = useState<Detail[]>(detail);
      const [editingId, setEditingId] = useState<number | null>(null);
      const [editeddetail, setEditeddetail] = useState<Detail | null>(null);
      const [showMessage, setShowMessage] = useState(false); // State for message box
      const[editMessage,setEditMessage]=useState(false);//state for edit message box
      const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for delete confirmation
      const [detailToDelete, setdetailToDelete] = useState<number | null>(null); // Track building to delete

      const resourceTypeOptions = [
  "Material",
  "Labor",
  "tool",
  "Machinery",
  "Other"
];
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
          const { name, value } = e.target;
          switch (name) {
             case 'id':
              setNewnormheaderid(value);
              break;
            case 'newresourcetype':
              setNewresourcetype(value);
              break;
            case 'newresourceid':
              setNewresourceid(value);
              break;
               case 'newunit':
              setNewunit(value);
              break;
               case 'newquantity':
              setNewquantity(value);
              break;
               case 'newwastage':
              setNewwastage(value);
              break;
               case 'newunitprice':
              setNewunitprice(value);
              break;
               case 'newamount':
              setNewamount(value);
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
         const filtered = detail.filter((details) => {
        if (searchType === 'resourcetype') {
        return details.resourcetype.toLowerCase().includes(searchQuery.toLowerCase());
        } 
        return false;
    });
        setFiltereddetail(filtered);
  };
    const handleAddItem = async () => {
    if ( newnormheaderid.trim()&& newresourcetype.trim() && newresourceid.trim() && newunit.trim() && newquantity.trim() && newwastage.trim() && newamount.trim() && newunitprice.trim()) {
      const newdetail: Detail = {
        detailid: Date.now(), // Generate a unique ID
        normheaderid:parseFloat(newnormheaderid.trim()),
        resourcetype: newresourcetype.trim(),
        resourceid: parseFloat(newresourceid.trim()),
        unit:newunit.trim(),
        quantity:parseFloat(newquantity.trim()),
        wastage: parseFloat(newwastage.trim()),
        unitprice:parseFloat(newunitprice.trim()),
        amount:parseFloat(newamount.trim()),
      };
      setdetail([...detail, newdetail]);
      setFiltereddetail([...detail, newdetail]); // Update filtered list
      setNewnormheaderid('');
      setNewresourcetype('');
      setNewresourceid('');
      setNewunit('');
      setNewquantity('');
      setNewwastage('');
      setNewunitprice('');
      setNewamount('');
      setShowMessage(true); // Show the message box
      try {
        console.log("object", newdetail)
       const response = await axios.post(
          'http://localhost:3000/api/normdetails/add',
          { newdetail },
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
   const handleEdit = (detail: Detail) => {
      setEditingId(detail.detailid);
      setEditeddetail({ ...detail }); // Create a copy for editing
  
    };
  
    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (editeddetail) {
        setEditeddetail({ ...editeddetail, [name]: value });
        
      }
    };

    

  // ...existing code...

const handleUpdate = async ()  => {
  if (editeddetail) {
    try {
      // Send update to backend
      const response = await axios.put(
        `http://localhost:3000/api/normdetails/update/${editeddetail.detailid}`,
        editeddetail,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update local state if backend update is successful
        const updateddetail = detail.map((detail1) =>
          detail1.detailid === editeddetail.detailid ? { ...editeddetail } : detail1
        );
        setdetail(updateddetail);
        setFiltereddetail(updateddetail);
        setEditingId(null);
        setEditeddetail(null);
        setEditMessage(true);
        setTimeout(() => setEditMessage(false), 3000);
      } else {
        // Handle error from backend
        alert("Update failed on server.");
      }
    } catch (error) {
      console.error("Error updating detail:", error);
      alert("Error updating detail.");
    }
     
  }
};

// ...existing code...
   const handleDeleteClick = (detailid: number) => {
    setdetailToDelete(detailid); // Set the building to delete
    setShowDeleteConfirmation(true); // Show the confirmation box
  };

  const confirmDelete = () => {
    if (detailToDelete !== null) {
      const updateddetail = detail.filter((detail1) => detail1.detailid !== detailToDelete);
      setdetail(updateddetail);
      setFiltereddetail(updateddetail); // Update filtered list
      setShowDeleteConfirmation(false); // Hide the confirmation box
      setdetailToDelete(null); // Reset the building to delete
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false); // Hide the confirmation box
    setdetailToDelete(null); // Reset the building to delete
  };

 const[idlist,setIdList]=useState([]);

  useEffect(() => {
  const fetchNormDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/normdetails/get-id',{
        withCredentials: true
      }); 

      const data = await response.data.data;
      setIdList(data);
      console.log("Norm Details:", data);
    } catch (error) {
      console.error("Failed to fetch norm details:", error);
    }
  };

  fetchNormDetails();
}, []);

  useEffect(() => {
  const fetchNormDetailsList = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/normdetails/get-all-data',{
        withCredentials: true
      }); 

      const data = await response.data.data;
      setdetail(data);
      setFiltereddetail(data);
      console.log("Norm Details list:", data);
    } catch (error) {
      console.error("Failed to fetch norm details:", error);
    }
  };

  fetchNormDetailsList();
}, []);


  
  return (
    <div className="ml-[20%] mt-[10%] h-screen">
        <h1 className="text-3xl font-bold mb-6">Norm Detail</h1>

      {/* Search Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Search Type</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            name="searchType"
            value={searchType}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/6"
          >
            <option value="labor">labor</option>
             <option value="tool">tool</option>

           
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
        <h2 className="text-xl font-semibold mb-2">Add New Norm Details</h2>
        <div className="flex flex-col md:flex-row gap-4">
         <select
          name="id"
          value={newnormheaderid.toString()}
          onChange={handleInputChange}
          className="border p-2 rounded w-40% md:w-1/3"
        >
          <option value="">Select id</option>
          {idlist.map((type : any) => (
            <option key={type} value={type.norm_id.toString()}>
              {type.norm_id}
            </option>
          ))}
        </select>
  
        <select
          name="newresourcetype"
          value={newresourcetype}
          onChange={handleInputChange}
          className="border p-2 rounded w-40% md:w-1/3"
        >
          <option value="">Select Resource Type</option>
          {resourceTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

          <input
            type="number"
            name="newresourceid"
            placeholder="resourceid"
            value={newresourceid}
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
            type="number"
            name="newquantity"
            placeholder="quantity"
            value={newquantity}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <input
            type="number"
            name="newwastage"
            placeholder="wastage"
            value={newwastage}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <input
            type="number"
            name="newunitprice"
            placeholder="unitprice"
            value={newunitprice}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <input
            type="number"
            name="newamount"
            placeholder="amount"
            value={newamount}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <button
            onClick={handleAddItem}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
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
        <h2 className="text-xl font-semibold mb-4">Norm Details List</h2>
         {/* Edit Success Message */}
  {editMessage && (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
      Update successful!
    </div>
  )}
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
            
              <th className="border px-4 py-2 text-left">resourcetype</th>
              <th className="border px-4 py-2 text-left">resourceid</th>
              <th className="border px-4 py-2 text-left">unit</th>
              <th className="border px-4 py-2 text-left">quantity</th>
              <th className="border px-4 py-2 text-left">wastage</th>
              <th className="border px-4 py-2 text-left">unitprice</th>
              <th className="border px-4 py-2 text-left">amount</th>
           
              
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtereddetail.map((detail) => (
              <tr key={detail.detailid}>
                {editingId === detail.detailid && editeddetail ? (
                  <>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="name"
                        value={editeddetail.resourcetype}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        name="resourceid"
                        value={editeddetail.resourceid}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                     <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="unit"
                        value={editeddetail.unit}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                     <td className="border px-4 py-2">
                      <input
                        type="number"
                        name="quantity"
                        value={editeddetail.quantity}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                     <td className="border px-4 py-2">
                      <input
                        type="number"
                        name="wastage"
                        value={editeddetail.wastage}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                      <td className="border px-4 py-2">
                      <input
                        type="number"
                        name="unitprice"
                        value={editeddetail.unitprice}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                      <td className="border px-4 py-2">
                      <input
                        type="number"
                        name="amount"
                        value={editeddetail.amount}
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
                    <td className="border px-4 py-2">{detail.resourcetype}</td>
                    <td className="border px-4 py-2">{detail.resourceid}</td>
                    <td className="border px-4 py-2">{detail.unit}</td>
                    <td className="border px-4 py-2">{detail.quantity}</td>
                    <td className="border px-4 py-2">{detail.wastage}</td>
                    <td className="border px-4 py-2">{detail.unitprice}</td>
                    <td className="border px-4 py-2">{detail.amount}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEdit(detail)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(detail.resourceid)}
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

export default detail
