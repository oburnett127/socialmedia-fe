import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import classes from './JobsList.module.css';

function SearchUser() {

    const {register, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = (data) => {
        const { data: results } = useQuery('userSearchResults',
            () => { return axios.get(process.env.REACT_APP_SERVER_URL + `/user/getuserbyname/${data.userSearch}`);}
        );
    }
    
    return (
        <>
            <p className={classes.message}>{message}</p>
            <form method={method} className={classes.form} errors={errors} onSubmit={handleSubmit(onSubmit)}>
                <p>
                    <label htmlFor="userSearch">Search Users</label>
                    <input type="text" {...register("userSearch", {required: true})} />
                </p>
                {errors?.userSearch && <span>The user's name is required.</span>}
                {/* <div className={classes.actions}>
                    <button type="submit">Submit</button>
                </div> */}
            </form>
        </>
    )
}

export default SearchUser;