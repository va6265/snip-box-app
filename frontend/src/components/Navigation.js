import React, { useContext } from 'react';
import { AppContext } from '../AppContext';

const Navigation = () => {
  const {  setCurrentPage } = useContext(AppContext);

  const handleNavItemClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <button onClick={() => handleNavItemClick('pasteList')}>Paste List</button>
      <button onClick={() => handleNavItemClick('createPaste')}>Create New Paste</button>
      {/* <button onClick={() => handleNavItemClick('viewPaste')}>View Paste</button> */}
    </div>
  );
};

export default Navigation;
