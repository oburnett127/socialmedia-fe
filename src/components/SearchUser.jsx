import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const getUsersData = (searchQuery) => {
  return axios.get(process.env.REACT_APP_SERVER_URL + `/user/getusersbyname/${searchQuery}`);
};

function SearchUser() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: usersSearchResults, refetch } = useQuery(
    ['usersSearch', searchQuery],
    () => getUsersData(searchQuery),
    { enabled: false }
  );

  const onSubmit = (data) => {
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
      { usersSearchResults?.data && (
        <ul>
          {usersSearchResults.data.map((user) => (
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
