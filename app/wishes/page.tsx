"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Heart, ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FloatingHearts } from "./FloatingHearts";

const PREDEFINED_IMAGES = [
  {
    id: 1,
    url: 'https://i.ibb.co/kVSXQ6Z6/IMG-20250221-WA0012.jpg',
    thumbnail: 'https://i.ibb.co/kVSXQ6Z6/IMG-20250221-WA0012.jpg'
  },
  {
    id: 2,
    url: 'https://i.ibb.co/G3sY0T3w/Screenshot-2025-02-20-230530.png',
    thumbnail: 'https://i.ibb.co/G3sY0T3w/Screenshot-2025-02-20-230530.png'
  },
  {
    id: 3,
    url: 'https://i.ibb.co/0RvBbFcF/IMG-20250221-WA0013.jpg',
    thumbnail: 'https://i.ibb.co/0RvBbFcF/IMG-20250221-WA0013.jpg'
  },
  {
    id: 4,
    url: 'https://i.ibb.co/k2q7p5H4/IMG-20250221-WA0015.jpg',
    thumbnail: 'https://i.ibb.co/k2q7p5H4/IMG-20250221-WA0015.jpg'
  }
];

interface Wish {
  id: string;
  name: string;
  message: string;
  timestamp: any;
  imageUrl?: string;
}

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState({ name: '', message: '', imageUrl: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "wishes"), (snapshot) => {
      const wishesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Wish[];
      setWishes(wishesData.sort((a, b) => b.timestamp - a.timestamp));
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.name || !newWish.message) {
      alert("Please fill in both name and message");
      return;
    }

    setSubmitting(true);
    try {
      const selectedImage = PREDEFINED_IMAGES.find(img => img.id === selectedImageId);
      
      const wishData = {
        name: newWish.name,
        message: newWish.message,
        imageUrl: selectedImage?.url || newWish.imageUrl,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "wishes"), wishData);
      setNewWish({ name: '', message: '', imageUrl: '' });
      setSelectedImageId(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding wish:", error);
      alert("Failed to add wish. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-8 relative overflow-hidden">
      <FloatingHearts />
      
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-64 h-64 rounded-full bg-pink-200/50 blur-3xl -top-32 -left-32" />
        <div className="absolute w-64 h-64 rounded-full bg-purple-200/50 blur-3xl -bottom-32 -right-32" />
      </div>

      <Link href="/" className="inline-flex items-center text-purple-800 mb-6 hover:text-purple-600 transition-colors">
        <ArrowLeft className="mr-2" /> Back to Home
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text"
          >
            Birthday Wishes
          </motion.h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity shadow-lg">
                <MessageCircle className="mr-2 h-4 w-4" />
                Add Wish
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-white to-pink-50">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-purple-800">Send Your Wishes</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={newWish.name}
                    onChange={(e) => setNewWish(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    value={newWish.message}
                    onChange={(e) => setNewWish(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Write your birthday wish..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Choose an Image</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PREDEFINED_IMAGES.map((image) => (
                      <div
                        key={image.id}
                        className={`relative aspect-video cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageId === image.id ? 'border-purple-500 scale-95' : 'border-transparent hover:border-purple-300'
                        }`}
                        onClick={() => setSelectedImageId(image.id)}
                      >
                        <Image
                          src={image.thumbnail}
                          alt="Predefined image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="imageUrl">Or paste custom image URL (optional)</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={newWish.imageUrl}
                    onChange={(e) => {
                      setNewWish(prev => ({ ...prev, imageUrl: e.target.value }));
                      setSelectedImageId(null);
                    }}
                    placeholder="Paste your image URL here"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Wish'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          <AnimatePresence>
            {wishes.map((wish, index) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-xl hover:shadow-2xl transition-shadow border border-purple-100"
              >
                <div className="flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-purple-800">{wish.name}</h3>
                      <p className="mt-2 text-gray-600 leading-relaxed">{wish.message}</p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="text-pink-500 hover:text-pink-600 transition-colors cursor-pointer" size={24} />
                    </motion.div>
                  </div>
                  {wish.imageUrl && (
                    <motion.div 
                      className="mt-4 relative w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="aspect-[16/9] relative">
                        <Image
                          src={wish.imageUrl}
                          alt={`Image from ${wish.name}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="rounded-lg object-contain"
                          onError={(e: any) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}