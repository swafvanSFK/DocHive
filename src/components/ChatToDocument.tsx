"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Input } from "./ui/input";
import * as Y from "yjs";
import { BotIcon, MessageCircleCode } from "lucide-react";
import Markdown from "react-markdown";

const ChatToDocument = ({ doc }: { doc: Y.Doc }) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();
    setQuestion(input);
    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();
      console.log(documentData);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            question:input,
          }),
        }
      );

      if(res.ok) {
        const {message} = await res.json();

        setInput("")
        setSummary(message);

        toast.success("Question asked successfully")

      }

    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button className="flex-1 md:flex-initial lg:flex-initial" asChild variant="outline">
        <DialogTrigger>
          <MessageCircleCode className="mr-2" />
          <span className="hidden md:block lg:block">Chat to Document</span>
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat to Document</DialogTitle>
          <DialogDescription>
            Ask a question and chat to the document with AI.
          </DialogDescription>
          <hr className="mt-5" />
          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
        </DialogHeader>

        {summary && (
          <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0" />
              <span className="font-bold">
                GPT {isPending ? "is thinking..." : "Says"}
              </span>
            </div>
            <span>{isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}</span>
          </div>
        )}

        <form className="flex gap-2" onSubmit={handleAskQuestion}>
          <Input
            type="text"
            placeholder="i.e. what is the about?"
            className="w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" disabled={!input || isPending}>
            {isPending ? "Asking..." : "Ask"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default ChatToDocument;