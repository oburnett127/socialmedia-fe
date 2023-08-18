import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useQuery } from 'react-query';
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

const jwtToken = localStorage.getItem('jwtToken');

const getUsersData = (searchQuery: string) => {
  return axios.get<IUser[]>(process.env.REACT_APP_SERVER_URL + `/user/getusersbyname/${searchQuery}`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    }
  });
};

function SearchUser() {
  const { register, handleSubmit, formState: { errors } } = useForm<IUserSearchFormInput>();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: usersSearchResults, refetch } = useQuery(
    ['usersSearch', searchQuery],
    () => getUsersData(searchQuery),
    { enabled: false }
  );

  const onSubmit: SubmitHandler<IUserSearchFormInput> = (data) => {
    setSearchQuery(data.searchQuery);
  };

  useEffect(() => {
    if (searchQuery !== '') {
      refetch();
    }
  }, [searchQuery, refetch]);

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
      {usersSearchResults?.data && (
        <ul>
          {usersSearchResults.data.map((user: IUser) => (
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

