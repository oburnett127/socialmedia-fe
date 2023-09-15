import React, { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { UserContext } from './UserContext';

interface IFormInput {
  postText: string;
}

function NewPost({ profUID }: { profUID: string }) {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const userContext = useContext(UserContext);
  const jwtToken = localStorage.getItem('jwtToken');

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (!userContext || !userContext.user) {
      return;
    }

    const formData = { authorUserId: userContext.user.id, profileUserId: profUID, text: data.postText };

    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/post/create', formData, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Post created:', response.data);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (!userContext || !userContext.user) {
    return (<p>The form could not be generated.</p>);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea {...register("postText", { required: true })} placeholder="Write a new post..." />
      <button type="submit">Submit</button>
    </form>
  );
}

export default NewPost;
