import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import JobDetail from './pages/JobDetail';

const router = createBrowserRouter([
  { path: '/', element: <Dashboard /> },
  { path: '/jobs/:id', element: <JobDetail /> }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App; 
