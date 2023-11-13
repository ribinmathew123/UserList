import {useState} from "react";
import { BASE_URL } from "../BaseUrl/BaseUrl";
import Modal from "./Modal/modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Posts } from "../models/posts.api.model";
import { Users } from "../models/user.api.model";

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Box />
    </QueryClientProvider>
  );
}

const Box: React.FC = () => {


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);


  const {
    isLoading: isLoadingUsers,
    error: errorUsers,
    data: users,
  } = useQuery<Users[], Error>({
    queryKey: ["users"],
    queryFn: () =>
      fetch(BASE_URL+"users").then((res) =>
        res.json()
      ),
  });

  const {
    isLoading: isLoadingPosts,
    error: errorPosts,
    data: posts,
  } = useQuery<Posts[], Error>({
    queryKey: ["post"],
    queryFn: () =>
      fetch(BASE_URL+"posts").then((res) =>
        res.json()
      ),
  });

  if (isLoadingUsers || isLoadingPosts) return "Loading...";

  if (errorUsers || errorPosts) return "An error has occurred.";

  const combinedData = users.map((user) => ({
    user,
    post: posts.find((post) => post.userId === user.id),
  }));


 const fetchComments = async (postId) => {
    try {
      const response = await fetch(`${BASE_URL}/comments?postId=${postId}`);
      const commentsData = await response.json();
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };





 
  const handleModalToggle = async (postId: number) => {
    setIsModalOpen(!isModalOpen);

    if (!isModalOpen) {
      await fetchComments(postId);
    }
  };




  return (
    <div className="p-8 " >
    {combinedData.map(({ user, post }) => (
      <div
        key={user.id}
        className="max-w-5xl mx-auto bg-white border border-blue-100 shadow-md rounded-md overflow-hidden p-4 mb-8 md:mb-12 lg:p-6 mt-20" 
        >
        <div className="flex flex-col md:flex-row items-center md:items-start mb-5"> 
          <img
            className="w-20 h-20 rounded-full mb-4 md:mb-0 md:mr-4" 
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
            alt="User Avatar"
          />
          <div>
            <p className="text-gray-400 font-thin text-lg mb-1 md:mb-0"> 
              {user.address?.street}
            </p>
            <p className="text-slate-950 text-xl md:text-3xl">{user?.name}</p> 
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-slate-950 font-mono font-semibold text-md md:text-lg"> 
            {post.title}
          </p>
          <p className="text-base md:text-lg text-slate-900">{post?.body}</p> 
        </div>
  
        <div className="flex justify-end mt-4"> 
          <button
            onClick={() => handleModalToggle(post.id)}
            className="py-2 px-4 bg-teal-700 hover:bg-teal-500 text-white font-bold rounded-md shadow-md text-xs md:text-sm flex items-center"
          >
            <FontAwesomeIcon icon={faComments} className="mr-2" />Show Comments
          </button>
        </div>
      </div>
    ))}
    {isModalOpen && (
      <Modal comments={comments} onClose={() => setIsModalOpen(false)} />
    )}
  </div>
  
  );
};
 