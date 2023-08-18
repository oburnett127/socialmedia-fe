import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { useForm, SubmitHandler } from 'react-hook-form';
import classes from './Post.module.css';

interface PostProps {
  postInfo: {
    postId: string;
    authorUserId: string;
    text: string;
  };
}

interface Comment {
  commentId: string;
  userId: string;
  text: string;
}

interface Users {
  [key: string]: {
    firstName?: string;
    lastName?: string;
  };
}

interface IFormInput {
  commentText: string;
}

function Post({ postInfo }: PostProps) {
  const [makeReply, setMakeReply] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<Users>({});

  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;

  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const jwtToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!user) return null;
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/getbypost/${postInfo.postId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          }
        });
        const commentsData = await response.json();
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      }
    };

    fetchComments();
  }, [postInfo.postId, user]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!user) return null;
        const userIds = comments.map(comment => comment.userId);
        userIds.push(postInfo.authorUserId);
        const uniqueUserIds = [...new Set(userIds)];

        for (const userId of uniqueUserIds) {
          const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/getuserbyuserid/${user.id}`);
          const userData = await response.json();
          setUsers(prevUsers => ({ ...prevUsers, [user.id]: userData }));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers({});
      }
    };

    fetchUsers();
  }, [comments, postInfo.authorUserId, user]);

  if (!userContext || !user) return null;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
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
        {makeReply && (<form onSubmit={handleSubmit(onSubmit)}>
            <textarea {...register("commentText", { required: true })} placeholder="Write a reply..." />
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
