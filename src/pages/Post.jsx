import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/appwriteConfig";
import { Button, Container } from "../components/index";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) setPost(post);
        else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  return post ? (
    <div className="py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto bg-gray-900 shadow-lg rounded-xl overflow-hidden">
          <div className="relative">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
            />
            {isAuthor && (
              <div className="flex flex-col items-center gap-2 absolute top-4 right-4 ">
                <Link to={`/edit-post/${post.$id}`}>
                  <button className="px-6 hover:bg-green-500 rounded bg-yellow-600">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={deletePost}
                  className="px-4 hover:bg-red-600 rounded bg-yellow-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <div className="p-4 sm:p-6 md:p-8">
            <h1 className=" text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-yellow-500">
              {post.title}
            </h1>
            <div className="flex flex-col gap-6 ">{parse(post.content)}</div>
          </div>
        </div>
      </Container>
    </div>
  ) : null;
}
