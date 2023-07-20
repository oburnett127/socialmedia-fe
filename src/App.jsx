import React, { useState } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import { UserContext } from './components/UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import HomePage from './pages/HomePage';
import RootLayout from './pages/RootLayout';
import AuthenticationPage from './pages/AuthenticationPage';
import LogoutPage from './pages/LogoutPage';
import FriendsPage from './pages/FriendsPage';
import RequestsPage from './pages/RequestsPage';
import UserPage from './pages/UserPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {

    const [user, setUser] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout />}>
                <Route index element={<HomePage />}></Route>
                <Route path="/auth" element={<AuthenticationPage />}></Route>
                <Route path="/logout" element={<LogoutPage />}></Route>
                <Route path="/friends" element={<FriendsPage />}></Route>
                <Route path="/requests" element={<RequestsPage />}></Route>
                <Route path="/mypage" element={<UserPage />}></Route>
                <Route path="*" element={<NotFoundPage />}></Route>
            </Route>
        )
    );

    return (
        <QueryClientProvider client={new QueryClient()}>
            <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
                <div className={"App"}>
                    <RouterProvider router={router} />
                </div>
            </UserContext.Provider>
        </QueryClientProvider>
    );
}

export default App;
