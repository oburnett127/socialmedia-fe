import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { useForm } from 'react-hook-form';
import classes from './Post.module.css';

function Post({ postInfo }) {
  const [makeReply, setMakeReply] = useState(false);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState({});

  const { register, handleSubmit, formState: { errors } } = useForm();
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userIds = comments.map(comment => comment.userId);
        userIds.push(postInfo.authorUserId);
        const uniqueUserIds = [...new Set(userIds)];

        for (const userId of uniqueUserIds) {
          const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/getuserbyuserid/${userId}`);
          const userData = await response.json();
          setUsers(prevUsers => ({ ...prevUsers, [userId]: userData }));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers({});
      }
    };

    fetchUsers();
  }, [comments, postInfo.authorUserId]);

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

      const commentData = await response.json();
      setComments(prevComments => [...prevComments, commentData]);
      setMakeReply(false);
    } catch (error) {
      console.error('Error creating comment', error);
    }
  }

  return (
    <div className={classes.card}>
        <span style={{ "marginTop": "30px" }} className={`${classes.postUserInfo} ${classes.floatLeft}`}>
            {users[postInfo.authorUserId]?.firstName} {users[postInfo.authorUserId]?.lastName}
        </span>
        <div className={`${classes.postText} ${classes.floatLeft}`}>{postInfo.text}</div>

        <button className={classes.replyButton} onClick={() => setMakeReply(true)}>Reply</button>
        {makeReply && (<form errors={errors} onSubmit={handleSubmit(onSubmit)}>
            <textarea {...register("commentText", { required: true })} text="Write a reply..." />
            <button type="submit">Submit</button>
        </form>
        )}

        <ul className={classes.ul}>
            {comments.map((comment) => (
            <li key={comment.commentId}>
                <span className={`${classes.commentUserInfo} ${classes.floatLeft}`}>
                    {users[comment.userId]?.firstName} {users[comment.userId]?.lastName}
                </span>
                <div className={`${classes.commentText} ${classes.floatLeft}`}>{comment.text}</div>
            </li>
            ))}
        </ul>
    </div>
  );
}

export default Post;
