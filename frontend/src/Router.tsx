import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";

const Layout = () => {
  return (
    <>
      <h1>Navbar</h1> // put navbar here later
      <Outlet />
      <h1>Footer</h1> // put footer here later
    </>
  );
};
const App = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <h1>Home</h1>,
        },
        {
          path: "/about",
          element: <h1>About</h1>,
        },
      ],
    },
    {
      path: "/admin",
      element: <h1>Admin</h1>,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
