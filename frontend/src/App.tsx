import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "react-toastify/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import RegisterUser from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UserHomePage from "./pages/UserHomePage";
import UsersLayouts from "./layouts/UsersLayouts";
import RegisterAssetsPage from "./pages/RegisterAssetsPage";
import AllAssetsPage from "./pages/AllAssetsPage";
import EditAssetPage from "./pages/EditAssetPage";
import DeleteAssetPage from "./pages/DeleteAssetPage";
import CategoriesPage from "./pages/CategoriesPage";
import EmployeesPage from "./pages/EmployeePage";
import AddEmployeePage from "./pages/AddEmployeePage";
import EditEmployeePage from "./pages/EditEmployeePage";
import DeleteEmployeePage from "./pages/DeleteEmployeePage";
import AssignmentsPage from "./pages/AssignmentPage";
import AddAssignmentPage from "./pages/AddAssignmentPage";
import MaintenanceLogsPage from "./pages/MaintenanceLogsPage";
import AddMaintenancePage from "./pages/AddMaintenancePage";
import EditMaintenancePage from "./pages/EditMaintenancePage";
import DeleteMaintenancePage from "./pages/DeleteMaintenancePage";
import AssignedToMePage from "./pages/AssignedToMePage";
import BrowseAssetsPage from "./pages/BrowseAssetsPage";
import ReportIssuePage from "./pages/ReportIssuePage";
import UserProfilePage from "./pages/UserProfilePage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="/user-home" element={<UsersLayouts />}>
          <Route path=":id" element={<UserHomePage />} />
          <Route path=":id/add-asset" element={<RegisterAssetsPage />} />
          <Route path=":id/all-assets" element={<AllAssetsPage />} />
          <Route
            path="/user-home/:id/edit-asset/:id"
            element={<EditAssetPage />}
          />
          <Route
            path="/user-home/:id/delete-asset/:id"
            element={<DeleteAssetPage />}
          />
          <Route
            path="/user-home/:id/categories"
            element={<CategoriesPage />}
          />
          <Route path="/user-home/:id/employees" element={<EmployeesPage />} />
          <Route
            path="/user-home/:id/add-employee"
            element={<AddEmployeePage />}
          />
          <Route
            path="/user-home/:id/edit-employee/:id"
            element={<EditEmployeePage />}
          />
          <Route
            path="/user-home/:id/delete-employee/:id"
            element={<DeleteEmployeePage />}
          />
          <Route
            path="/user-home/:id/assignments"
            element={<AssignmentsPage />}
          />
          <Route
            path="/user-home/:id/add-assignment"
            element={<AddAssignmentPage />}
          />
          <Route
            path="/user-home/:id/maintenance"
            element={<MaintenanceLogsPage />}
          />
          <Route
            path="/user-home/:id/add-maintenance"
            element={<AddMaintenancePage />}
          />
          <Route
            path="/user-home/:id/edit-maintenance/:id"
            element={<EditMaintenancePage />}
          />
          <Route
            path="/user-home/:id/delete-maintenance/:id"
            element={<DeleteMaintenancePage />}
          />
          <Route
            path="/user-home/:id/assigned-to-me"
            element={<AssignedToMePage />}
          />
          <Route
            path="/user-home/:id/browse-assets"
            element={<BrowseAssetsPage />}
          />
           
          <Route
            path="/user-home/:id/report-issue"
            element={<ReportIssuePage />}
          />
          <Route path="/user-home/:id/profile" element={<UserProfilePage />} />
          <Route path="/user-home/:id/settings" element={<SettingsPage />} /> 
        </Route>
      </Route>,
    ),
  );

  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer />
    </>
  );
}

export default App;
