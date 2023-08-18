import { Link } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from './UserContext'

interface FormData {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

function AuthForm() {
    const userContext = useContext(UserContext);
    if (!userContext) throw new Error("AuthForm must be used within a provider that provides UserContext");
    const { setUser, setIsLoggedIn } = userContext;
    const [isLogin, setIsLogin] = useState<'login' | 'signup'>('login');
    const [message, setMessage] = useState<string>('');

    const { register, handleSubmit } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            setMessage('');

            let authData = {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName
            };

            let url = '';

            if(isLogin === 'login') {
                url = process.env.REACT_APP_SERVER_URL + '/user/login';
                console.log("user is logging in");
            } else {
                url = process.env.REACT_APP_SERVER_URL + '/user/signup';
                console.log("registration request");
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(authData),
            });

            if (isLogin !== 'login' && response.status === 409) {
                setMessage('The email address you entered is already taken. Please enter a different email.');
                throw new Error('The email address you entered is already taken. Please enter a different email.');
            }

            //console.log("isLogin: " + isLogin);
            //console.log("response.status: " + response.status);

            if (!response.ok) {
                setMessage('Log in or registration failed');
                throw new Error('Could not authenticate user.');
            }

            const resData = await response.json();
            const jwtToken = resData.token;

            localStorage.setItem('jwtToken', jwtToken);
            const expiration = new Date();
            expiration.setHours(expiration.getHours() + 2);
            localStorage.setItem('expiration', expiration.toISOString());

            setMessage('Log in or sign up was successful');
            setIsLoggedIn(true);

            //console.log("setting isLoggedIn to true");

            try {
                const response = await fetch(process.env.REACT_APP_SERVER_URL + `/user/getuserbyemail/${data.email}`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    }
                });
                const user = await response.json();
                console.log('user is: ', user);
                setUser(user);
                console.log("userId is: " + user.id);
            } catch (error: any) {
                if (error?.response) {
                    console.log(error.response);
                } else if (error?.request) {
                    console.log("network error");
                } else {
                    console.log(error);
                }
            }
        } catch(err) {
            console.log(err);
        }
    };

    const handleToggleMode = () => {
        setMessage('');
        if(isLogin === 'login') setIsLogin('signup');
        else setIsLogin('login');
    }
 
    return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>{isLogin === 'login' ? 'Log in' : 'Create a new user'}</h1>
                <p>{message}</p>
                <p>
                    <label htmlFor="email">Email</label>
                    <input type="email" {...register("email", {required: true})} />
                </p>
                <p>
                    <label htmlFor="password">Password</label>
                    <input type="password" {...register("password", {required: true})} />
                </p>
                {isLogin === 'signup' && (
                    <>
                        <p>
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" {...register("firstName", {required: true})} />
                        </p>
                        <p>
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" {...register("lastName", {required: true})} />
                        </p>
                    </>
                )}
                <div>
                    <Link to={'/auth'} onClick={handleToggleMode}>
                        {isLogin === 'login' ? 'Create new user' : 'Login'}
                    </Link>
                    <button type="submit" style={{"marginLeft": "16px"}}>Submit</button>
                </div>
            </form>
    );
}
  
export default AuthForm;
