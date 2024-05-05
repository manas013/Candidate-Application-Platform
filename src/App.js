import { createBrowserRouter, RouterProvider } from "react-router-dom";
import JobListings from "./jobsearch/Jobmainpage";
import JobDetails from "./jobsearch/JobDetails";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <JobListings />,
    },
    {
      path: "/JobDetails/:id",
      element: <JobDetails />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
