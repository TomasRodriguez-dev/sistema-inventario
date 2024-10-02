import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { Provider } from 'react-redux';  
import store from './redux/store';  
import { AlertProvider } from './context/AlertContext';
import { UserProvider } from './context/UserContext';
import AlertComponent from './components/common/alert/AlertComponent';
import GlobalProgressBar from './components/common/progress-bar/GlobalProgressBar';
import AppRoutes from './routes/AppRoutes';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  return (
    <Provider store={store}> 
      <PrimeReactProvider>
        <AlertProvider>
          <UserProvider>
            <Router>
              <GlobalProgressBar />
              <AlertComponent />
              <AppRoutes />
            </Router>
          </UserProvider>
        </AlertProvider>
      </PrimeReactProvider>
    </Provider>
  );
}

export default App;
