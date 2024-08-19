import { Link } from "react-router-dom";
import appwriteService from "../appwrite/appwriteConfig";

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-gray-900 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="w-full h-0 pb-56 relative mb-4">
            <img
              src={appwriteService.getFilePreview(featuredImage)}
              alt={title}
              className="absolute top-0 left-0 w-full h-full rounded-xl object-cover"
            />
          </div>
          <h2 className="text-center text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 hover:text-yellow-300 truncate">
            {title}
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
