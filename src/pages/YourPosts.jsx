import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, PostCard } from "../components/index";
import appwriteService from "../appwrite/appwriteConfig";
import { Button } from "../components/index";
import { Link } from "react-router-dom";
import { Loader } from "../components/index";

const YourPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(true);
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
      } finally {
        setLoader(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => post.userId === userData.$id);

  if (loader) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

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
            <div className="flex flex-col gap-4 max-md:gap-2 justify-center text-center px-2 items-center w-full h-[400px] ">
              <p className="text-2xl max-md:text-xl">
                Get started by creating your first post now!
              </p>
              <Link to={"/add-post"}>
                <Button className="w-24 font-semibold px-2">Add Post</Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default YourPosts;
