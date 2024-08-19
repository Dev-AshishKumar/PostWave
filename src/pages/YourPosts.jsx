import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, PostCard } from "../components/index";
import appwriteService from "../appwrite/appwriteConfig";

const YourPosts = () => {
  const [posts, setPosts] = useState([]);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await appwriteService.getAllPosts();
        if (response) {
          setPosts(response.documents);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => post.userId === userData.$id);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.$id}
                className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
              >
                <PostCard {...post} />
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center w-full h-[400px]">
              <p className="text-center text-yellow-400 text-2xl">
                Posts are currently loading, or it looks like you haven't
                created any yet. Go ahead and create your first post!
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default YourPosts;
