import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Post from './Post';

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
      <div>
        <ul>
          {posts.map((post) => (
            <li key={uuidv4()}>
              <Post postInfo={post} />
            </li>
          ))}
        </ul>
      </div>
    ) : null
  );
}

export default PostsList;
