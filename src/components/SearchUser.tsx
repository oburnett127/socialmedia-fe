import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface IUserSearchFormInput {
  searchQuery: string;
}

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
}

function SearchUser() {
  const { register, handleSubmit, formState: { errors } } = useForm<IUserSearchFormInput>();
  const [searchQuery, setSearchQuery] = useState('');

  const jwtToken = localStorage.getItem('jwtToken');

  const [data, setData] = useState<IUser[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!searchQuery) return;
    
    const fetchData = async () => {
      try {
        const response = await axios.get<IUser[]>(`${process.env.REACT_APP_SERVER_URL}/user/getusersbyname/${encodeURIComponent(searchQuery)}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          }
        });
        setData(response.data);
      } catch (error: any) {
        setError(error);
      }
    };

    fetchData();
  }, [searchQuery, jwtToken]);

  const onSubmit: SubmitHandler<IUserSearchFormInput> = (data) => {
    setSearchQuery(data.searchQuery);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>
          <label htmlFor="searchQuery">Search Users</label>
          <input type="text" {...register("searchQuery", { required: true })} />
        </p>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      {errors?.searchQuery && <span>The user's name is required.</span>}
      {data && (
        <ul>
          {data.map((user: IUser) => (
            <li key={user.id}>
              <Link to={{ pathname: `/otheruserprofile/${user.id}` }}>
                {user.firstName} {user.lastName}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default SearchUser;
