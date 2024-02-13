import './App.css';
import { ReservationProvider } from 'context/ReservationContext';
import { RouterProvider } from 'react-router-dom';
import router from './routes';

function App() {
  return (
    <ReservationProvider>
      <RouterProvider router={router} />
    </ReservationProvider>
  );
}

export default App;
