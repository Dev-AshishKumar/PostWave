import { useState, useEffect } from "react";
import appwriteService from "../appwrite/appwriteConfig";
import { Button, Container, PostCard } from "../components/index";
import { Link } from "react-router-dom";
import { Loader } from "../components/index";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(1);
  const postPerPage = 12;

  useEffect(() => {
    const fetchingPosts = async () => {
      try {
        const response = await appwriteService.getAllPosts();
        if (response) {
          setPosts(response.documents.reverse());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoader(false);
      }
    };
    fetchingPosts();
  }, []);

  const handleNext = () => {
    if (page * postPerPage < posts.length) {
      setPage(page + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const totalPages = Math.ceil(posts.length / postPerPage);

  if (loader) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {posts.length === 0 ? (
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
            connect with a vibrant community, and share your unique ideas with
            the world.
          </p>

          <h4 className="text-4xl  text-center mb-2  max-sm:text-2xl max-sm:font-semibold">
            Start Your Journey
          </h4>
          <p className="text-center text-gray-400 max-sm:text-sm  max-sm:px-2">
            Dive in and start sharing your thoughts today.{" "}
            <Link className="text-yellow-400" to={"/login"}>
              Login
            </Link>{" "}
            &nbsp;or&nbsp;
            <Link className="text-yellow-400" to={"/signup"}>
              Create an Account
            </Link>{" "}
            to write your first post and join a community of thinkers, dreamers,
            and doers.
          </p>
        </div>
      ) : (
        <div className="w-full py-8">
          <Container>
            <div className="flex flex-wrap ">
              {posts
                .slice((page - 1) * postPerPage, page * postPerPage)
                .map((post) => (
                  <div
                    key={post.$id}
                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
                  >
                    <PostCard {...post} />
                  </div>
                ))}
            </div>

            {/* Pagination Part */}
            {posts.length > postPerPage && (
              <div className="flex gap-4 justify-center mx-6 mt-6 max-sm:text-xs max-sm:gap-0 max-sm:mx-1">
                <Button
                  onClick={handlePrevious}
                  disabled={page === 1}
                  className="w-28 py-0 max-sm:w-24 max-sm:px-1"
                >
                  Previous
                </Button>

                {[...Array(totalPages).keys()].map((pageNumber) => {
                  if (
                    pageNumber + 1 === 1 ||
                    pageNumber + 1 === 2 ||
                    pageNumber + 1 === totalPages ||
                    pageNumber + 1 === totalPages - 1 ||
                    (pageNumber + 1 >= page - 1 && pageNumber + 1 <= page + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber + 1}
                        onClick={() => handlePageClick(pageNumber + 1)}
                        className={`mx-1 px-3 py-1 text-white rounded font-bold ${
                          page === pageNumber + 1
                            ? "bg-yellow-400"
                            : "bg-gray-800"
                        }`}
                      >
                        {pageNumber + 1}
                      </button>
                    );
                  }

                  if (
                    (pageNumber + 1 === page - 2 && page > 3) ||
                    (pageNumber + 1 === page + 2 && page < totalPages - 2)
                  ) {
                    return (
                      <span key={pageNumber + 1} className="mx-2 text-white">
                        ...
                      </span>
                    );
                  }

                  return null;
                })}

                <Button
                  onClick={handleNext}
                  disabled={page * 12 >= posts.length}
                  className="w-28 py-0 max-sm:w-24 max-sm:px-1"
                >
                  Next
                </Button>
              </div>
            )}
          </Container>
        </div>
      )}
    </>
  );
};

export default Home;
