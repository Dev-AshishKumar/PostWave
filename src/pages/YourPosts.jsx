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
  const [page, setPage] = useState(1);
  const postPerPage = 12;
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await appwriteService.getAllPosts();
        if (response) {
          setPosts(response.documents.reverse());
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = userData
    ? posts.filter((post) => post.userId === userData.$id)
    : [];

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

        {/* Pagination Part */}
        {filteredPosts.length > postPerPage && (
          <div className="flex gap-4 justify-center mx-6 mt-6 max-sm:text-xs max-sm:gap-0 max-sm:mx-1">
            <button
              onClick={handlePrevious}
              disabled={page === 1}
              className="w-28 py-0 bg-yellow-600 hover:bg-yellow-800 text-white rounded max-sm:w-14 max-sm:px-1"
            >
              Previous
            </button>

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
                      page === pageNumber + 1 ? "bg-yellow-400" : "bg-gray-800"
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

            <button
              onClick={handleNext}
              disabled={page * 12 >= posts.length}
              className="w-28 py-0 bg-yellow-600 hover:bg-yellow-800 text-white rounded max-sm:w-14 max-sm:px-1"
            >
              Next
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default YourPosts;
