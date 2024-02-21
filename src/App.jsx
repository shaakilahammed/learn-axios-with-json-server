import { useEffect, useState } from 'react';
import AddPost from './components/AddPost';
import EditPost from './components/EditPost';
import Posts from './components/Posts';
import axios from './utils/axios';
const App = () => {
    const [error, setError] = useState('');
    const [post, setPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const handleAddPost = async (newPost) => {
        try {
            const id = posts.length
                ? Number(posts[posts.length - 1].id) + 1
                : 1;
            const response = await axios.post('/posts', {
                id: id.toString(),
                ...newPost,
            });
            setPosts([...posts, response.data]);
        } catch (err) {
            if (err.response) {
                setError(
                    `Status: ${err.response.status} - ${err.response.statusText}`
                );
            } else {
                setError(err.message);
            }
        }
    };
    const handleEditPost = async (updatedPost) => {
        try {
            await axios.patch(`/posts/${updatedPost.id}`, updatedPost);
            setPosts(
                posts.map((item) =>
                    item.id === updatedPost.id ? updatedPost : item
                )
            );
        } catch (err) {
            if (err.response) {
                setError(
                    `Status: ${err.response.status} - ${err.response.statusText}`
                );
            } else {
                setError(err.message);
            }
        }
    };
    const handleDeletePost = async (postId) => {
        if (confirm('Do you want to really delete this?')) {
            try {
                await axios.delete(`/posts/${postId}`);
                setPosts(posts.filter((item) => item.id !== postId));
            } catch (err) {
                if (err.response) {
                    setError(
                        `Status: ${err.response.status} - ${err.response.statusText}`
                    );
                } else {
                    setError(err.message);
                }
            }
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/posts');
                if (response && response.data) {
                    setPosts(response.data);
                }
            } catch (err) {
                if (err.response) {
                    setError(
                        `Status: ${err.response.status} - ${err.response.statusText}`
                    );
                } else {
                    setError(err.message);
                }
            }
        };
        fetchPosts();
    }, []);
    return (
        <div>
            <div>
                <h1>API Request with Axios</h1>
                <hr />

                <div>
                    <Posts
                        posts={posts}
                        onDeletePost={handleDeletePost}
                        onEditClick={setPost}
                    />

                    <hr />

                    {!post ? (
                        <AddPost onAddPost={handleAddPost} />
                    ) : (
                        <EditPost
                            key={post.id}
                            post={post}
                            onEditPost={handleEditPost}
                            onReset={() => setPost(null)}
                        />
                    )}

                    {error && (
                        <>
                            <hr />
                            <div className="error">{error}</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
