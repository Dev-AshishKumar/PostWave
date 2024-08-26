import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Input, Select, RTE, Loader } from "../index";
import appwriteService from "../../appwrite/appwriteConfig";
import { toast } from "sonner";

export default function PostForm({ post }) {
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const { register, handleSubmit, control, watch, setValue, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "Active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const submit = async (data) => {
    try {
      setLoader(true);
      if (post) {
        const file = data.image[0]
          ? await appwriteService.updateFile(data.image[0])
          : null;

        if (file) {
          await appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : undefined,
        });

        if (dbPost) {
          toast.success("Post updated successfully");
          navigate(`/post/${dbPost.$id}`);
        }
        setLoader(false);
      } else {
        setLoader(true);
        const file = await appwriteService.uploadFile(data.image[0]);

        if (file) {
          const fileId = file.$id;
          data.featuredImage = fileId;

          const dbPost = await appwriteService.createPost({
            ...data,
            userId: userData.$id,
          });

          if (dbPost) {
            toast.success("Post created successfully");
            navigate(`/post/${dbPost.$id}`);
          }
          setLoader(false);
        } else {
          toast.error("Something went wrong! Please Read Guidelines");
          console.error("File upload failed");
          return;
        }
      }
    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-")
        .slice(0, 25);

    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [slugTransform, watch, setValue]);

  if (!userData || !userData.$id) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Title"
              placeholder="Enter post title"
              className="w-full"
              {...register("title", { required: true })}
            />
          </div>
          <div>
            <Input
              label="Post Id"
              placeholder="post-id"
              className="w-full"
              {...register("slug", { required: true, maxLength: 25 })}
              onInput={(e) => {
                const value = slugTransform(e.currentTarget.value);
                setValue("slug", value.slice(0, 25), {
                  shouldValidate: true,
                });
              }}
            />
          </div>
        </div>

        <div>
          <RTE
            label="Content"
            name="content"
            control={control}
            defaultValue={getValues("content")}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Image"
              type="file"
              className="w-full"
              accept="image/png, image/jpg, image/jpeg, image/gif"
              {...register("image", { required: !post })}
            />
            {post && (
              <div className="mt-2">
                <img
                  src={appwriteService.getFilePreview(post.featuredImage)}
                  alt={post.title}
                  className="rounded-lg max-h-48 w-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex justify-center items-end">
            <Select
              options={["Active"]}
              label="Status"
              className="w-full"
              {...register("status", { required: true })}
              defaultValue="Active"
            />
          </div>
        </div>

        <div className="flex justify-center gap-6 max-sm:flex-col">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-red-600 w-full p-2 text-lg font-semibold transition-colors hover:bg-opacity-90"
          >
            Read Guidelines
          </button>
          {loader ? (
            <Button className="flex justify-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-fit p-2 text-lg font-semibold transition-colors hover:bg-opacity-90"
            >
              {post ? "Update Post" : "Create Post"}
            </Button>
          )}
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="z-10 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#02020E]   p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center text-yellow-400">
              Important Guidelines
            </h2>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">
                <strong className="text-yellow-400">Content Guidelines</strong>:
                Please refrain from creating posts that are inappropriate,
                irrelevant, or contain adult content.
              </li>
              <li className="mb-2">
                <strong className="text-yellow-400">Image Guidelines</strong>:
                Upload only JPEG, JPG, or PNG images. Rename your images using
                simple, descriptive words without any numbers or symbols.
              </li>
              <li className="mb-2">
                <strong className="text-yellow-400">
                  Keep Post IDs Concise
                </strong>
                : Ensure post IDs are less than 26 characters. If your title
                makes the post ID too long, it will be automatically truncated
                to 25 characters.
              </li>
              <li className="mb-2">
                <strong className="text-yellow-400">Post Status</strong>: All
                posts are set to 'Active' status by default. Currently, this is
                the only available option.
              </li>
            </ul>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
