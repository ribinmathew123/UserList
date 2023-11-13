import React from "react";

interface ModalProps {
  comments: Comment[];
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ comments, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-md w-full sm:w-5/6 md:w-3/4 lg:w-1/2 xl:w-1/3">
        <h2 className="text-3xl font-bold mb-4 text-teal-800">Comments</h2> {/* Increased font size and added a teal color */}
        <ul className="list-disc pl-6"> {/* Added list styling and adjusted padding */}
          {comments.map((comment) => (
            <li key={comment.id} className="text-gray-700">
              <strong className="text-teal-600">{comment.name}</strong>: {comment.body} {/* Adjusted text color */}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-outline-teal" // Styled the Close button
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
