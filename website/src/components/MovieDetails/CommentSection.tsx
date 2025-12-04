import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

async function fetchComments(movieId: number) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/movies/${movieId}/comments`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }
  return res.json();
}

async function postComment(movieId: number, content: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/movies/${movieId}/comments`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ content }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Failed to post comment" }));
    throw new Error(error.detail || "Failed to post comment");
  }
  return res.json();
}

async function deleteComment(movieId: number, commentId: number) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/movies/${movieId}/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete");
}

export default function CommentsSection({ movieId }: { movieId: number }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", movieId],
    queryFn: () => fetchComments(movieId),
    enabled: !loading,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const postMutation = useMutation({
    mutationFn: () => postComment(movieId, content),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["comments", movieId] });
    },
    onError: (error: Error) => {
      alert(error.message || "Failed to post comment");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(movieId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", movieId] });
    },
    onError: () => {
      alert("Failed to delete comment");
    },
  });

  if (loading || isLoading) {
    return <div className="text-gray-400">Loading comments...</div>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6 text-white">
        Comments ({comments.length})
      </h2>

      {user ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            postMutation.mutate();
          }}
          className="mb-8"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={postMutation.isPending}
            className="mt-3 px-6 py-3 bg-black border border-white text-white font-bold rounded-lg cursor-pointer hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50"
          >
            {postMutation.isPending ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-lg text-center">
          <p className="text-gray-400 mb-4">You need to be logged in to comment</p>
          <button
            onClick={() => navigate({ to: "/login", search: { from: location.pathname } })}
            className="px-8 py-3 bg-black border border-white text-white font-bold rounded-lg cursor-pointer hover:bg-white hover:text-black transition-colors duration-300"
          >
            Log In to Comment
          </button>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet. Be the first!</p>
        ) : (
          comments.map((c: any) => (
            <div key={c.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-white">{c.username}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>

                {user && c.user_id === user.id && (
                  <button
                    onClick={() => deleteMutation.mutate(c.id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-400 cursor-pointer hover:text-red-300 transition hover:scale-110"
                    title="Delete comment"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="text-gray-300">{c.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}