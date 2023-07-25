import { React, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import axios from 'axios';
import { UserContext } from './UserContext';


function NewPost() {

  const { user } = useContext(UserContext);

  const createPost = async (postData) => {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/post/create', postData);
      return response.data;
    };

  const {register, handleSubmit, formState: {errors}} = useForm();

  const mutation = useMutation(createPost, {
      onSuccess: (data) => {
        console.log('Post created:', data);
      },
      onError: (error) => {
        console.error('Error creating post:', error);
      },
    });

    const onSubmit = (data) => {
       const formData = { userId: user.id, text: data.postText};
       mutation.mutate(formData);
   };

    return (
        <form errors={errors} onSubmit={handleSubmit(onSubmit)}>
            <textarea {...register("postText", {required: true})} text="Write a new post..." />
            <button type="submit">Submit</button>
        </form>
    );
}

export default NewPost;
