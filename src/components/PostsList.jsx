import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import classes from './JobsList.module.css';

function PostsList({ id }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/post/getbyuserid/${id}`);
        const postsData = await response.json();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      }
    };
    fetchPosts();
  }, [id]);

  return (
    Array.isArray(posts) && posts.length > 0 ? (
      <div className={classes.posts}>
        <ul className={classes.list}>
          {posts.map((post) => (
            <li key={uuidv4()} className={classes.item}>
              {post.text}
            </li>
          ))}
        </ul>
      </div>
    ) : null
  );
}

export default PostsList;
