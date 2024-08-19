import { useState, useEffect } from "react";
import appwriteService from "../appwrite/appwriteConfig";
import { Container, PostCard } from "../components/index";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    appwriteService.getAllPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
  }, []);

  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-2 py-20  max-w-4xl">
        <h1 className="text-5xl font-grand-hotel  text-center mb-8">
          Welcome to <span className=" text-yellow-300">PostWave</span>
        </h1>

        <h3 className="text-5xl text-center mb-8 ">
          Discover, Share, and Inspire
        </h3>

        <p className="text-center mb-8 ">
          Whether you're a seasoned writer, a passionate blogger, or just
          someone with a story to tell, this is the place where your voice can
          shine, where words flow freely and ideas find their perfect home. At
          PostWave, we believe in the power of storytelling. Our platform is
          designed to be a creative space where you can explore new
          perspectives, connect with a vibrant community, and share your unique
          thoughts with the world.
        </p>

        <h4 className="text-4xl  text-center mb-2  ">Start Your Journey</h4>
        <p className="text-center ">
          Ready to make waves? Dive in and start sharing your thoughts today.
          Create an account, write your first post, and join a community of
          thinkers, dreamers, and doers.
        </p>
      </div>
    );
  }
  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap ">
          {posts.map((post) => (
            <div
              key={post.$id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
            >
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Home;
