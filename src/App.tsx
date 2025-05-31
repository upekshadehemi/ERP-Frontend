import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';
import Dashboard from './components/SideBar';
import Roads from './pages/road';
import Build from './pages/build';
import Detail from './pages/detail';
import Header from './pages/header'
import Category from './pages/category';
import Home from './pages/home';




const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      
      {/* Flex Layout for Sidebar + Main Content */}
      <div className="flex">
        <Dashboard />
        
        {/* Main content area */}
        <div className="flex-1 p-4">
          <Routes>
            
          <Route path='/group/bulidings' element={<Build/>}/>
           <Route path='/group/Roads' element={<Roads/>}/>
          <Route path='/detail' element={<Detail/>}/>
          <Route path='/header' element={<Header/>}/>
          <Route path='/category' element={<Category/>}/>
            <Route path='/home' element={<Home/>}/>


        
   
          
   
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

