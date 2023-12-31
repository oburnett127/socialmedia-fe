import React from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RootLayout from './pages/RootLayout';
import AuthenticationPage from './pages/AuthenticationPage';
import LogoutPage from './pages/LogoutPage';
import FriendsPage from './pages/FriendsPage';
import RequestsPage from './pages/RequestsPage';
import NotificationsPage from './pages/NotificationsPage';
import CurrentUserPage from './pages/CurrentUserPage';
import OtherUserPage from './pages/OtherUserPage';
import NotFoundPage from './pages/NotFoundPage';
import { UserProvider } from './components/UserContext';

function App() {

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout />}>
                <Route index element={<HomePage />}></Route>
                <Route path="/auth" element={<AuthenticationPage />}></Route>
                <Route path="/logout" element={<LogoutPage />}></Route>
                <Route path="/friends" element={<FriendsPage />}></Route>
                <Route path="/requests" element={<RequestsPage />}></Route>
                <Route path="/notifications" element={<NotificationsPage />}></Route>
                <Route path="/currentuserprofile" element={<CurrentUserPage />}></Route>
                <Route path="/otheruserprofile/:id" element={<OtherUserPage />}></Route>
                <Route path="*" element={<NotFoundPage />}></Route>
            </Route>
        )
    );

    return (
        <UserProvider>
            <div className={"App"}>
                <RouterProvider router={router} />
            </div>
        </UserProvider>
    );
}

export default App;
