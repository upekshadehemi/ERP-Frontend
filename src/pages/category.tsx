import React, { useState } from 'react';

interface category {
  id: number; // Add an ID for tracking items
  name: string;
  description: string;
}

function Category() {
  const [Categories, setCategories] = useState<category[]>([
    { id: 1, name: 'buildings', description: 'buildings' },
  ]);

  const [newcategoryName, setNewcategoryName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [searchType, setSearchType] = useState('name'); // State for search type (id or name)
  const [filteredCategory, setFilteredCategory] = useState<category[]>(Categories);
  const [editingcategoryId, setEditingcategoryId] = useState<number | null>(null);
  const [editedcategory, setEditedcategory] = useState<category | null>(null);

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

  const handleAddItem = () => {
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
            Add Category
          </button>
        </div>
      </div>

      {/* Norm Category List Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Norm Category List</h2>
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Description</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategory.map((category) => (
              <tr key={category.id}>
                {editingcategoryId === category.id && editedcategory ? (
                  <>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="name"
                        value={editedcategory.name}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="description"
                        value={editedcategory.description}
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
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Category;