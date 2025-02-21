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
import { Sparkles } from "./Sparkles";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Switch } from "@/components/ui/switch";

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

const genAI = new GoogleGenerativeAI("AIzaSyCLzWWQOLDUcUAAn4ZAxbwaSG5Srp5DsDU");

const ENHANCE_PROMPT = `You are a poetic birthday wish enhancer. Make the given birthday wish more beautiful and heartfelt while keeping the core sentiment intact. Add some poetic elements and emojis, but keep it natural and personal.elongate the wish to 4-5 lines.`;

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
  const [enhancing, setEnhancing] = useState(false);
  const [useAI, setUseAI] = useState(false);

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

  const enhanceMessage = async (message: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(`${ENHANCE_PROMPT}\nOriginal wish: ${message}`);
      const enhancedMessage = await result.response.text();
      return enhancedMessage;
    } catch (error) {
      console.error('Error enhancing message:', error);
      return message;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.name || !newWish.message) {
      alert("Please fill in both name and message");
      return;
    }

    setSubmitting(true);
    try {
      const selectedImage = PREDEFINED_IMAGES.find(img => img.id === selectedImageId);
      
      let finalMessage = newWish.message;
      if (useAI) {
        setEnhancing(true);
        finalMessage = await enhanceMessage(newWish.message);
      }
      
      const wishData = {
        name: newWish.name,
        message: finalMessage,
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
      setEnhancing(false);
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
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enhance with AI</Label>
                    <p className="text-sm text-gray-500">
                      Make your wish more poetic ✨
                    </p>
                  </div>
                  <Switch
                    checked={useAI}
                    onCheckedChange={setUseAI}
                    className="data-[state=checked]:bg-purple-500"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                  disabled={submitting}
                >
                  {submitting ? (
                    enhancing ? 'Enhancing with AI...' : 'Sending...'
                  ) : (
                    useAI ? 'Send Enhanced Wish ✨' : 'Send Wish'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-3"> {/* Reduced gap */}
          <AnimatePresence>
            {wishes.map((wish, index) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/80 backdrop-blur-md rounded-xl p-3 hover:bg-white/90 
                  shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                  border border-purple-100/50 relative overflow-hidden
                  transition-all duration-300 ease-in-out"
                whileHover={{ y: -2 }}
              >
                <div className="flex gap-3"> {/* Reduced gap */}
                  {wish.imageUrl && (
                    <motion.div 
                      className="relative w-1/5 flex-shrink-0" // Reduced width
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="aspect-[3/4] relative rounded-lg overflow-hidden ring-2 ring-purple-100/50 group-hover:ring-purple-200">
                        <Image
                          src={wish.imageUrl}
                          alt={`Image from ${wish.name}`}
                          fill
                          sizes="(max-width: 768px) 20vw, 15vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="flex-1 overflow-hidden"> {/* Changed from min-w-0 to overflow-hidden */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 overflow-hidden"> {/* Added flex-1 and overflow-hidden */}
                        <h3 className="font-semibold text-2xl text-purple-800 mb-2 overflow-ellipsis overflow-hidden">
                          {wish.name}
                        </h3>
                        <p className="text-lg text-gray-600 leading-relaxed overflow-hidden">
                          {wish.message}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex-shrink-0"
                      >
                        <Heart 
                          className="text-pink-500/80 hover:text-pink-500 transition-colors cursor-pointer 
                            filter drop-shadow-[0_2px_8px_rgba(219,39,119,0.3)]" 
                          size={24}
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative bottom animation */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20" />
                <motion.div
                  className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"
                  animate={{
                    x: ["0%", "200%"],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <Sparkles />
                
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                  <div className="absolute top-[-50%] right-[-50%] w-16 h-16 bg-gradient-to-bl from-purple-100/40 rotate-45" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}