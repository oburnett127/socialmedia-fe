import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { useForm } from 'react-hook-form';

function Post({ postInfo }) {
    const [makeReply, setMakeReply] = useState(false);
    const [comments, setComments] = useState([]);

    const {register, handleSubmit, formState: {errors}} = useForm();
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchComments = async () => {
          try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/getbypost/${postInfo.postId}`);
            const commentsData = await response.json();
            setComments(commentsData);
          } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]);
          }
        };
        
        fetchComments();
    }, [postInfo.postId]);

    const onSubmit = async (data) => {
        try {
            const requestData = {
                postId: postInfo.postId,
                userId: user.id,
                text: data.commentText
            };
    
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
        } catch (error) {
            console.error('Error creating comment', error);
        }
    }

    return (
        <>
            <p style={{"margin-top": "30px"}}>{postInfo.text}</p>
            <button onClick={() => setMakeReply(true)}>Reply</button>
            {makeReply && (<form errors={errors} onSubmit={handleSubmit(onSubmit)}>
                <textarea {...register("commentText", {required: true})} text="Write a reply..." />
                <button type="submit">Submit</button>
            </form>
            )}
            <ul>
                {comments.map((comment) => (
                        <li><p>{comment.text}</p></li>
                ))}
            </ul>
        </>
    );
}

export default Post;