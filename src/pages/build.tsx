import React, { useState } from 'react';

interface buildings {
  id: number; // Add an ID for tracking items
  name: string;
  description: string;
}

function Build() {
  const [Buildings, setBuildings] = useState<buildings[]>([
    { id: 1, name: 'Building A', description: 'Description A' },
  ]);

  const [newbuildName, setNewbuildName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [searchType, setSearchType] = useState('name'); // State for search type (id or name)
  const [filteredBuildings, setFilteredBuildings] = useState<buildings[]>(Buildings);
  const [editingBuildingId, setEditingBuildingId] = useState<number | null>(null);
  const [editedBuilding, setEditedBuilding] = useState<buildings | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'newbuildName':
        setNewbuildName(value);
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
    const filtered = Buildings.filter((building) => {
      if (searchType === 'name') {
        return building.name.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (searchType === 'id') {
        return building.id.toString().includes(searchQuery);
      }
      return false;
    });
    setFilteredBuildings(filtered);
  };

  const handleAddItem = () => {
    if (newbuildName.trim() && newDescription.trim()) {
      const newBuilding: buildings = {
        id: Date.now(), // Generate a unique ID
        name: newbuildName.trim(),
        description: newDescription.trim(),
      };
      setBuildings([...Buildings, newBuilding]);
      setFilteredBuildings([...Buildings, newBuilding]); // Update filtered list
      setNewbuildName('');
      setNewDescription('');
    }
  };

  const handleEdit = (building: buildings) => {
    setEditingBuildingId(building.id);
    setEditedBuilding({ ...building }); // Create a copy for editing
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedBuilding) {
      setEditedBuilding({ ...editedBuilding, [name]: value });
    }
  };

  const handleUpdate = () => {
    if (editedBuilding) {
      const updatedBuildings = Buildings.map((building) =>
        building.id === editedBuilding.id ? { ...editedBuilding } : building
      );
      setBuildings(updatedBuildings);
      setFilteredBuildings(updatedBuildings); // Update filtered list
      setEditingBuildingId(null);
      setEditedBuilding(null);
    }
  };

  const handleDelete = (id: number) => {
    const updatedBuildings = Buildings.filter((building) => building.id !== id);
    setBuildings(updatedBuildings);
    setFilteredBuildings(updatedBuildings); // Update filtered list
  };

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

      {/* Add New Norm Group Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Norm Group</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="newbuildName"
            placeholder="Building Name"
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
            Add Building
          </button>
        </div>
      </div>

      {/* Norm Group List Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Norm Group List</h2>
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Description</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBuildings.map((building) => (
              <tr key={building.id}>
                {editingBuildingId === building.id && editedBuilding ? (
                  <>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="name"
                        value={editedBuilding.name}
                        onChange={handleEditInputChange}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="description"
                        value={editedBuilding.description}
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
                        onClick={() => handleDelete(building.id)}
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

export default Build;