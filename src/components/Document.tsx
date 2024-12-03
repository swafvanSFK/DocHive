"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";


const Document = ({ id }: { id: string }) => {
  const [data] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();
  const isOwner = useOwner()

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      startTransition(() => {
        updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };

  return (
    <div className="flex-1 h-full p-0 md:p-5 lg:p-5">
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form className="flex flex-1 flex-col gap-2 md:flex-row lg:flex-row" onSubmit={updateTitle}>
          {/* Update title */}
          <div className="flex flex-1 flex-row gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "Update"}
          </Button>
          </div>
          {/* IF */}
          <div className="flex gap-2">
          {isOwner && (
            <> 
            {/* Invite user*/}
            <InviteUser/>
            {/* Delete document */}
              <DeleteDocument/>
              <div className="flex flex-1 md:hidden lg:hidden">
                <ManageUsers/>
              </div>
            </>
          )}
          </div>
          {/* isOwner && InviteUser, DeleteDocument */}
        </form>
      </div>
      <div className="flex flex-col md:flex-row lg:flex-row max-w-6xl mx-auto justify-between md:items-center lg:items-center mb-5">
        {/* Manage Users */}
        <div className="hidden md:block lg:block">
          <ManageUsers/>
        </div>

        {/* Avatars */}
        <Avatars/>
      </div>
      <hr className="pb-5 md:pb-10 lg:pb-10" />
      {/* Collaborative Editor */}
      <Editor/>
    </div>
  );
};
export default Document;
