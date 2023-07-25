import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

function Post({ postInfo }) {
    const [makeReply, setMakeReply] = useState(false);
    const [displayNewComment, setDisplayNewComment] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');
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

            if (response.ok) {
                setDisplayNewComment(true);
                setNewCommentText(data.commentText);
            }
        } catch (error) {
            console.error('Error creating comment', error);
        }
    }

    return (
        <>
            <article>
                <p>{postInfo.text}</p>
            </article>
            <button onClick={() => setMakeReply(true)}>Reply</button>
            {makeReply && (<form errors={errors} onSubmit={handleSubmit(onSubmit)}>
                <textarea {...register("commentText", {required: true})} text="Write a reply..." />
                <button type="submit">Submit</button>
            </form>
            )}
            {
                <div>
                    <ul>
                    {comments.map((comment) => (
                        <li key={uuidv4()}>
                            <p text={comment.text}></p>
                        </li>
                    ))}
                    </ul>
                </div>
            }
            {displayNewComment && (
                <p text={newCommentText}></p>
            )}
        </>
    );
}

export default Post;