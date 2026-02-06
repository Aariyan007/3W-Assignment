import { useState } from 'react';
import './PostCard.css';

const PostCard = ({ post, currentUser, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const hasLiked = post.likes?.includes(currentUser?.username) || false;

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      const response = await fetch(`https://threew-assignment-vt12.onrender.com/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: currentUser.username }),
      });

      const updatedPost = await response.json();
      onUpdate(updatedPost);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isCommenting) return;

    setIsCommenting(true);

    try {
      const response = await fetch(`https://threew-assignment-vt12.onrender.com/api/posts/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: currentUser.username,
          text: commentText,
        }),
      });

      const updatedPost = await response.json();
      onUpdate(updatedPost);
      setCommentText('');
    } catch (error) {
      console.error('Error commenting:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postTime) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return postTime.toLocaleDateString();
  };

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <div className="user-avatar">
          {post.username?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="user-info">
          <h3>{post.username || 'Unknown User'}</h3>
          <span className="post-time">{formatTime(post.createdAt)}</span>
        </div>
      </div>

      {/* Post Content */}
      {post.text && <p className="post-text">{post.text}</p>}
      
      {post.imageUrl && (
        <div className="post-image">
          <img src={post.imageUrl} alt="Post content" />
        </div>
      )}

      {/* Post Actions */}
      <div className="post-actions">
        <button 
          className={`action-btn ${hasLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={isLiking}
        >
          <svg viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61C20.3292 4.09943 19.7228 3.69353 19.0554 3.41696C18.3879 3.14038 17.6725 2.99854 16.95 2.99854C16.2275 2.99854 15.5121 3.14038 14.8446 3.41696C14.1772 3.69353 13.5708 4.09943 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3506 11.8792 21.7565 11.2728 22.033 10.6054C22.3096 9.93789 22.4515 9.22248 22.4515 8.5C22.4515 7.77752 22.3096 7.06211 22.033 6.39464C21.7565 5.72718 21.3506 5.12082 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{post.likes?.length || 0} {(post.likes?.length || 0) === 1 ? 'Like' : 'Likes'}</span>
        </button>

        <button 
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{post.comments?.length || 0} {(post.comments?.length || 0) === 1 ? 'Comment' : 'Comments'}</span>
        </button>
      </div>

      {/* Show who liked - only if there are likes */}
      {post.likes?.length > 0 && (
        <div className="likes-info">
          <span className="likes-text">
            Liked by <strong>{post.likes[0]}</strong>
            {post.likes.length > 1 && (
              <> and <strong>{post.likes.length - 1} other{post.likes.length > 2 ? 's' : ''}</strong></>
            )}
          </span>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          {post.comments?.length > 0 && (
            <div className="comments-list">
              {post.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <div className="comment-avatar">
                    {comment.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="comment-content">
                    <span className="comment-username">{comment.username || 'Unknown'}</span>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form className="comment-form" onSubmit={handleComment}>
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isCommenting}
            />
            <button type="submit" disabled={!commentText.trim() || isCommenting}>
              {isCommenting ? (
                <div className="spinner-small"></div>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 8L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;