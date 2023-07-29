// Router.js
import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import PasteList from './PasteList';
import CreatePasteForm from './CreatePasteForm';
import ViewPaste from './ViewPaste';

const MyRouter = () => {
  const { currentPage } = useContext(AppContext);

  const renderPage = () => {
    switch (currentPage) {
      case 'pasteList':
        return <PasteList />;
      case 'createPaste':
        return <CreatePasteForm />;
      case 'viewPaste':
        return <ViewPaste />;
      default:
        return <PasteList />;
    }
  };

  return <>{renderPage()}</>;
};

export default MyRouter;
