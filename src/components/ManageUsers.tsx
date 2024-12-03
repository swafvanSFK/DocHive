"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import useOwner from "@/lib/useOwner";
import { useRoom } from "@liveblocks/react/suspense";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { removeUserFromDocument } from "../../actions/action";

const ManageUsers = () => {
  const { user } = useUser();
  const room = useRoom();
  const isOwner = useOwner();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  const handleDelete = async (userId: string) => {
    startTransition(async () => {
      if (!user) return;

      const { success } = await removeUserFromDocument(room.id, userId);

      if (success) {
        toast.success("User removed from room successfully");
      } else {
        toast.error("Failed to remove user from room!");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button className="flex-1" asChild variant="outline">
        <DialogTrigger>Users({usersInRoom?.docs.length})</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Users with Access</DialogTitle>
          <DialogDescription>
            Below is a list of users who have access to this document.
          </DialogDescription>
        </DialogHeader>
        <hr className="my-2" />
        {/* Users in room */}
        <div className="flex flex-col space-y-2">
          {usersInRoom?.docs.map((doc) => {
            const userData = doc.data();
            const isCurrentUser = userData.userId === user?.emailAddresses[0].toString();
            
            return (
              <div
                key={`${doc.id}-${userData.userId}`} // Use a combination of doc.id and userId
                className="flex items-center justify-between"
              >
                <p className="font-light">
                  {isCurrentUser
                    ? `You (${userData.userId})`
                    : userData.userId}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline">{userData.role}</Button>
                  {isOwner && !isCurrentUser && (
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(userData.userId)}
                      disabled={isPending}
                      size="sm"
                    >
                      {isPending ? "Removing..." : "X"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageUsers;