import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAll } from '../services/api';
import PostCard from '../components/PostCard'; 

const SearchResultsPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    if (!query) {
      setResults({ jobs: [], people: [], posts: [] });
      setLoading(false);
      return;
    }
    const performSearch = async () => {
      try {
        setLoading(true);
        const data = await searchAll(query);
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [query]);

  if (loading) return <div className="text-center p-10">Searching...</div>;
  if (!results) return <div className="text-center p-10">No results found.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">People</h2>
        {results.people.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.people.map(person => (
              <Link to={`/profile/${person._id}`} key={person._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <p className="font-bold">{person.name}</p>
                <p className="text-sm text-gray-500 capitalize">{person.role}</p>
              </Link>
            ))}
          </div>
        ) : <p className="text-gray-500">No people found matching your search.</p>}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Jobs</h2>
        {results.jobs.length > 0 ? (
          results.jobs.map(post => <PostCard key={post._id} post={post} />)
        ) : <p className="text-gray-500">No jobs found matching your search.</p>}
      </section>

      <section>
        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Posts</h2>
        {results.posts.length > 0 ? (
          results.posts.map(post => <PostCard key={post._id} post={post} />)
        ) : <p className="text-gray-500">No other posts found matching your search.</p>}
      </section>
    </div>
  );
};

export default SearchResultsPage;