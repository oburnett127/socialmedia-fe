import React, { useState, useEffect } from 'react';
import Post from './Post';

function PostsList({ id }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_SERVER_URL + `/post/getbyprofile/${id}`);
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
          {posts.map((post) => (
              <Post postInfo={post} />
          ))}
      </div>
    ) : null
  );
}

export default PostsList;
