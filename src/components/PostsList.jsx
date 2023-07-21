import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from './UserContext';
import { useQuery } from 'react-query';
import axios from 'axios';
import classes from './JobsList.module.css';

function PostsList() {

    const { user } = useContext(UserContext);

    const { data: postsData, loading: isLoading } = useQuery('postsList',
      () => { return axios.get(process.env.REACT_APP_SERVER_URL + `/post/getbyuserid/${user.id}`);}
    );

    const posts = isLoading ? [] : postsData;

    return (
        posts?.data && (
            <div className={classes.posts}>
                <ul className={classes.list}>
                    {postsData.data?.map((post) => (
                        <li key={uuidv4()} className={classes.item}>
                            {post.text}
                        </li>
                    ))}
                </ul>
            </div>
        )
    )
}

export default PostsList;
