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

interface Wish {
  id: string;
  name: string;
  message: string;
  imageUrl?: string;
  timestamp?: any;
}

interface NewWish {
  name: string;
  message: string;
  imageUrl: string;
}

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState<NewWish>({
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
      })) as Wish[];
      setWishes(wishesData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmitWish = async (e: React.FormEvent<HTMLFormElement>) => {
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

  // ...existing code...
}
