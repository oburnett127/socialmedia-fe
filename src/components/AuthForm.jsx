import { Link } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import classes from './AuthForm.module.css';
import { UserContext } from './UserContext';
import { useForm } from 'react-hook-form';
  
function AuthForm() {
    const { setUser, setIsLoggedIn } = useContext(UserContext);
    const [isLogin, setIsLogin] = useState('login');
    const [message, setMessage] = useState('');

    const {register, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = async (data) => {
        try {
            setMessage('');
            //console.log("line 1");

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

            //console.log("line 6");
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(authData),
            });

            if (isLogin !== 'login' && response.status === 409) {
                //console.log("line 8");
                setMessage('The email address you entered is already taken. Please enter a different email.');
                throw new Error('The email address you entered is already taken. Please enter a different email.');
            }

            //console.log("isLogin: " + isLogin);
            //console.log("response.status: " + response.status);

            if (!response.ok) {
                //console.log("line 9");
                setMessage('Log in or registration failed');
                throw new Error('Could not authenticate user.');
            }

            const resData = await response.json();
            const token = resData.token;

            localStorage.setItem('token', token);
            const expiration = new Date();
            expiration.setHours(expiration.getHours() + 2);
            localStorage.setItem('expiration', expiration.toISOString());

            setMessage('Log in or sign up was successful');
            setIsLoggedIn(true);

            //console.log("setting isLoggedIn to true");

            try {
                const response = await fetch(process.env.REACT_APP_SERVER_URL + `/user/getuserbyemail/${data.email}`);
                const user = await response.json();
                setUser(user);
                console.log("userId is: " + user.id);
            } catch (error) {
                if (error.response) {
                    console.log(error.response);
                } else if (error.request) {
                    console.log("network error");
                } else {
                    console.log(error);
                }
            }
        } catch(err) {
            //console.log("line 10");
            console.log(err);
        }
    };

    const handleToggleMode = () => {
        setMessage('');
        if(isLogin === 'login') setIsLogin('signup');
        else setIsLogin('login');
    }
 
    return (
            <form className={classes.form} errors={errors} onSubmit={handleSubmit(onSubmit)}>
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
                <div className={classes.actions}>
                    <Link to={'/auth'} onClick={handleToggleMode}>
                        {isLogin === 'login' ? 'Create new user' : 'Login'}
                    </Link>
                    <button type="submit">Submit</button>
                </div>
            </form>
    );
}
  
export default AuthForm;
