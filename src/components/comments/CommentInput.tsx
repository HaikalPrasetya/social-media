import { PostData } from "@/lib/types";
import { useSubmitComment } from "./mutations";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, SendHorizonal } from "lucide-react";

interface CommentInputProps {
  post: PostData;
}

function CommentInput({ post }: CommentInputProps) {
  const [content, setContent] = useState("");

  const mutation = useSubmitComment(post.id);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate({ content, post });
    setContent("");
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full items-center gap-2">
      <Input
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!content.trim() || mutation.isPending}
      >
        {!mutation.isPending ? (
          <SendHorizonal />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </form>
  );
}

export default CommentInput;
