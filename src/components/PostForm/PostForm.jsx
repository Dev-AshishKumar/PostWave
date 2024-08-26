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
            <Button type="submit" className="w-full">
              <Loader className={`h-fit justify-center w-48 m-auto`} />
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
