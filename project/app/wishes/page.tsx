"use client";

import { motion } from "framer-motion";
import { MessageCircle, Heart, ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function WishesPage() {
  const [wishes, setWishes] = useState([]);
  const [newWish, setNewWish] = useState({
    name: "",
    message: "",
    imageUrl: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const wishesRef = collection(db, "wishes");
    const unsubscribe = onSnapshot(wishesRef, (snapshot) => {
      const wishesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWishes(wishesData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmitWish = async (e) => {
    e.preventDefault();
    try {
      const wishesRef = collection(db, "wishes");
      await addDoc(wishesRef, {
        ...newWish,
        timestamp: serverTimestamp(),
      });
      setNewWish({ name: "", message: "", imageUrl: "" });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding wish:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100 via-purple-200 to-indigo-200 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={20} />
              Back to Card
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-purple-900">Birthday Wishes 💝</h1>
        </div>

        <div className="grid gap-6">
          {wishes.map((wish, index) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl">
                  {wish.imageUrl ? (
                    <img src={wish.imageUrl} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : "✨"}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">{wish.name}</h3>
                  <p className="text-gray-700">{wish.message}</p>
                  {wish.imageUrl && (
                    <img src={wish.imageUrl} alt="Wish image" className="mt-4 rounded-lg max-w-sm" />
                  )}
                </div>
                <Button variant="ghost" size="icon" className="text-rose-500">
                  <Heart size={20} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 rounded-full shadow-lg">
                <MessageCircle className="mr-2 h-6 w-6" />
                Add Your Wish
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Send Your Birthday Wish</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitWish} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={newWish.name}
                  onChange={(e) => setNewWish({ ...newWish, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  value={newWish.message}
                  onChange={(e) => setNewWish({ ...newWish, message: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  value={newWish.imageUrl}
                  onChange={(e) => setNewWish({ ...newWish, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <Button type="submit" className="mt-4">Send Wish</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}