import { React } from 'react';
import { useForm } from 'react-hook-form';

function NewPost() {

    const {register, handleSubmit, formState: {errors}} = useForm();

    return (
        <textarea {...register("postText", {required: true})} text="Write a new post..." />
    );
}

export default NewPost;
