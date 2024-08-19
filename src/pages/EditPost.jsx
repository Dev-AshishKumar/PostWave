import { useEffect, useState } from "react";
import { Container, PostForm } from "../components/index";
import appwriteService from "../appwrite/appwriteConfig";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = () => {
  const [post, setPosts] = useState(null);
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPosts(post);
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);
  return post ? (
    <div className="py-8">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
};

export default EditPost;
