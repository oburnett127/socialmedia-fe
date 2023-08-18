import React, { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';
import axios from 'axios';
import { UserContext } from './UserContext';

interface IFormInput {
  postText: string;
}

function NewPost({ profUID }: { profUID: string }) {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const userContext = useContext(UserContext);
  const jwtToken = localStorage.getItem('jwtToken');
  
  const mutation = useMutation(
    async (postData: any) => {
      if (!userContext) throw new Error('User context not available');
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/post/create', postData, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        }
      });
      return response.data;
    },
    {
      onSuccess: (data: any) => {
        console.log('Post created:', data);
      },
      onError: (error: string) => {
        console.error('Error creating post:', error);
      },
    }
  );

  if (!userContext || !userContext.user) {
    return (<p>The form could not be generated.</p>)
  } 
  const { user } = userContext;

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const formData = { authorUserId: user.id, profileUserId: profUID, text: data.postText };
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea {...register("postText", { required: true })} placeholder="Write a new post..." />
      <button type="submit">Submit</button>
    </form>
  );
}

export default NewPost;
