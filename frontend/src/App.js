// App.js
import React, { useState } from 'react';
import { AppContext, AppProvider } from './AppContext';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navigation from './components/Navigation';
import MyRouter from './components/MyRouter';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('pasteList');

  return (
    <AppProvider value={{ currentPage, setCurrentPage }}>
     <Router>
          <div>
            <Navigation />
            <Switch>
              <Route exact path="/" component={MyRouter} />
              <Route path="/login" component={LoginPage} />
              <Route path="/signup" component={SignupPage} />
            </Switch>
          </div>
        </Router>
    </AppProvider>
  );
};

export default App;
