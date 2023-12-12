"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

const API_BASE_URL = "http://hn.algolia.com/api/v1";

const Details = () => {
  const params = useParams();
  const id = params.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (id) {
          const response = await axios.get(`${API_BASE_URL}/items/${id}`);
          setPost(response.data);
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <div className="w-full mx-auto flex items-center justify-center">
      {loading ? (
        <div className=" min-h-screen w-full flex items-center justify-center ">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        post && (
          <div className="w-[90%] md:w-[100%] p-4 mt-4">
            <h2 className="text-3xl font-bold"> Title : {post?.title}</h2>
            <p className="font-medium">Points: {post.points}</p>
            <div className="mt-14">
              {post.children &&
                post.children.map((comment) => (
                  <div className="flex flex-col gap-1 mt-3" key={comment?.id}>
                    <div className="flex gap-2 font-semibold">
                      Author : <p> {comment?.author}</p>
                    </div>
                    <div
                      className="bg-[#303030] p-2 px-4 ml-3 rounded-[.6rem]"
                      key={comment.id}
                      dangerouslySetInnerHTML={{ __html: comment?.text }}
                    />
                  </div>
                ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Details;
