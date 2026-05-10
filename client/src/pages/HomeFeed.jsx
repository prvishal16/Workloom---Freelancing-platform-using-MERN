import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllPosts, getMyConnections } from '../services/api';
import PostCard from '../components/PostCard.jsx';
import CreatePost from '../components/CreatePost.jsx';
import { Search } from 'lucide-react';

const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, connectionsData] = await Promise.all([
          getAllPosts(),
          getMyConnections(),
        ]);
        setPosts(postsData);
        setConnections(connectionsData);
      } catch (err) {
        setError('Failed to fetch data for the feed.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm.trim()}`);
    }
  };

  if (loading) return <div className="text-center p-10">Loading feed...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <form onSubmit={handleSearchSubmit} className="relative lg:hidden mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm" />
        </form>
        
        <CreatePost onPostCreated={handleNewPost} />
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">The feed is empty.</p>
        ) : (
          posts.map(post => <PostCard key={post._id} post={post} />)
        )}
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block lg:col-span-4">
        <div className="bg-white rounded-lg shadow-md p-5 sticky top-24">
          <h3 className="font-bold text-lg mb-4">My Network</h3>
          {connections.length > 0 ? (
            <ul className="space-y-3">
              {connections.map(connection => (
                <li key={connection._id}>
                  <Link to={`/profile/${connection._id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                    
                    {connection.profilePictureUrl ? (
                        <img src={connection.profilePictureUrl} alt={connection.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center font-bold text-blue-600">
                            {connection.name.charAt(0)}
                        </div>
                    )}

                    <div>
                      <p className="font-semibold text-sm">{connection.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{connection.role}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">You haven't made any connections yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeFeed;