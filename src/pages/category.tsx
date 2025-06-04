import axios from 'axios';
import React, { useEffect,useState } from 'react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface category {
  id: number; // Add an ID for tracking items
  name: string;
  description: string;
}

function Category() {
 // const [Categories, setCategories] = useState<category[]>([
    //{ id: 1, name: 'buildings', description: 'buildings' },
  //]);
  const [Categories, setCategories] = useState<category[]>([]);
  
    useEffect(() => {
      console.log("Categories",Categories );
    }, [Categories]);
 const [showModal, setShowModal] = useState(false);
  const [newcategoryName, setNewcategoryName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [searchType, setSearchType] = useState('name'); // State for search type (id or name)
  const [filteredCategory, setFilteredCategory] = useState<category[]>(Categories);
  const [editingcategoryId, setEditingcategoryId] = useState<number | null>(null);
  const [editedcategory, setEditedcategory] = useState<category | null>(null);
  const [showMessage, setShowMessage] = useState(false); // State for message box
  const [updatecategory,setUpdatecategory] =  useState<category | null>(null);

   const handleSubmit = () => {
    alert("Form submitted!");
    setShowModal(false);
  };
   const showpopup = ( { id:id, name, description }: category) => {
  
   setUpdatecategory({ id, name, description });
   setShowModal(true);
 };

 const handleDownloadPDF = () => {
   const doc = new jsPDF();
 
   // Title
   doc.setFontSize(16);
   doc.text("Norm Group List", 14, 15);
 
   // Prepare table rows from filteredBuildings data
   const rows = filteredCategory.map((category) => [
     category.id || "-",
     category.name || "-",
     category.description || "-",
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
   doc.save("norm-category-list.pdf");
 };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'newcategoryName':
        setNewcategoryName(value);
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
    const filtered = Categories.filter((category) => {
      if (searchType === 'name') {
        return category.name.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (searchType === 'id') {
        return category.id.toString().includes(searchQuery);
      }
      return false;
    });
    setFilteredCategory(filtered);
  };

  const handleAddItem = async () => {
    if (newcategoryName.trim() && newDescription.trim()) {
      const newcategory: category = {
        id: Date.now(), // Generate a unique ID
        name: newcategoryName.trim(),
        description: newDescription.trim(),
      };
      setCategories([...Categories, newcategory]);
      setFilteredCategory([...Categories, newcategory]); // Update filtered list
      setNewcategoryName('');
      setNewDescription('');
      setShowMessage(true); // Show the message box
      try {
        console.log("object", newcategory)
       const response = await axios.post(
          'http://localhost:3000/api/normcatagory/add',
          { newcategory },
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

  const handleEdit = (category: category) => {
    setEditingcategoryId(category.id);
    setEditedcategory({ ...category }); // Create a copy for editing
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedcategory) {
      setEditedcategory({ ...editedcategory, [name]: value });
    }
  };

  const handleUpdate = () => {
    if (editedcategory) {
      const updatedCategories = Categories.map((category) =>
        category.id === editedcategory.id ? { ...editedcategory } : category
      );
      setCategories(updatedCategories);
      setFilteredCategory(updatedCategories); // Update filtered list
      setEditingcategoryId(null);
      setEditedcategory(null);
    }
  };

  const handleDelete = (id: number) => {
    const updatedCategories = Categories.filter((category) => category.id !== id);
    setCategories(updatedCategories);
    setFilteredCategory(updatedCategories); // Update filtered list
  };
  

  
  useEffect(() => {
  const fetchcategoryList = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/normcatagory/get-all-data',{
        withCredentials: true
      }); 

      const data = await response.data.data;
      setCategories(data);
      setFilteredCategory(data);
      console.log("Norm category list:", data);
    } catch (error) {
      console.error("Failed to fetch norm details:", error);
    }
  };

  fetchcategoryList();
}, []);

 
  return (
    <div className="ml-[20%] mt-[10%] h-screen">
      <h1 className="text-3xl font-bold mb-6">Norm Category</h1>

      {/* Search Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Search Norm Category</h2>
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

      {/* Add New Norm Category Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Norm Category</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="newcategoryName"
            placeholder="Category Name"
            value={newcategoryName}
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


      {/* Norm Category List Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Norm Category List</h2>
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              {/* <th className="border px-4 py-2 text-left">ID</th> */}
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Description</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategory.map((category) => (
              <tr key={category.id}>
                {/* {editingcategoryId === category.id && editedcategory ? ( */}
                  <>
                    <td className="border px-4 py-2">
                     
                         <label   className="border rounded p-1 w-full">{category.name}</label>
                        </td> 
                    <td className="border px-4 py-2">
                       <label   className="border rounded p-1 w-full">{category.name}</label>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                       onClick={ () =>showpopup({id:category.id, name:category.name, description:category.description,})}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Update
                      </button>
                    </td>
                  </>
                {/* ) : (
                  <>
                    <td className="border px-4 py-2">{category.name}</td>
                    <td className="border px-4 py-2">{category.description}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )
                }
                 */}
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
                type="text"
                value={updatecategory?.name || ''}
                 onChange={(e) => setUpdatecategory({ ...(updatecategory ||{ id: 0, name: '', description: '' }), name: e.target.value 
                })
              }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">  
              <label className="block mb-2">Description:</label>
              <input
                type="text"
                value={updatecategory?.description || ''}
                 onChange={(e) =>
                setUpdatecategory({
                ...(updatecategory || { id: 0, name: '', description: '' }), description: e.target.value,
                 
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
                onClick={handleSubmit}
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

export default Category;