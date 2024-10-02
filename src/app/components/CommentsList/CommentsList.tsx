import { IComment, IUser } from "@/app/posts/[id]/page";
import { FC } from "react";

interface ICommentsList {
  comments: IComment[];
  users: IUser[];
  currentUser: IUser | null;
  deleteComment: (id: string) => void;
}

const CommentsList: FC<ICommentsList> = ({
  comments,
  users,
  currentUser,
  deleteComment,
}) => {
  return (
    <ul className="mb-5 grid gap-4">
      {comments.map((comment, index) => {
        const user = users.find((user) => user._id === comment.userId);

        return (
          <li key={index} className="flex items-center justify-between">
            <div>
              <h5 className="font-bold">{user?.name || "Unknown"}</h5>
              <p className="pl-3">{comment.text}</p>
            </div>
            {currentUser?._id === comment.userId ? (
              <button
                onClick={() => deleteComment(comment._id)}
                className="bg-red-500 relative z-10 text-white rounded px-5 py-2 ml-4"
              >
                Delete
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};

export default CommentsList;
