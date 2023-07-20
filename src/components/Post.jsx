import { React } from 'react';
import classes from './JobItem.module.css';

function Post({ post }) {

    return (
        <article className={classes.post}>
            <p>{post.text}</p>
        </article>
    );
}

export default Post;