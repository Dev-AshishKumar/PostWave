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
      <div className="container mx-auto px-2 py-20 max-md:py-14  max-w-4xl ">
        <h1 className="text-5xl font-grand-hotel  text-center mb-8 max-sm:mb-6 max-sm:text-4xl">
          Welcome to <span className=" text-yellow-300">PostWave</span>
        </h1>

        <h3 className="text-5xl text-center mb-8  max-sm:mb-4 max-sm:text-2xl max-sm:font-semibold ">
          Discover, Share and Inspire
        </h3>

        <p className="text-center mb-8 text-gray-400  max-sm:text-sm  max-sm:px-2 ">
          Whether you're a seasoned writer or someone with a story to tell,
          PostWave is where your voice shines. We believe in the power of
          storytelling and offer a creative space to explore new perspectives,
          connect with a vibrant community, and share your unique ideas with the
          world.
        </p>

        <h4 className="text-4xl  text-center mb-2  max-sm:text-2xl max-sm:font-semibold">
          Start Your Journey
        </h4>
        <p className="text-center text-gray-400 max-sm:text-sm  max-sm:px-2">
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
