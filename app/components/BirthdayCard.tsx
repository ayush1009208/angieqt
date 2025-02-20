"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";
import { Volume2, VolumeX, Cake, Stars, Gift, Camera, Clock, Share2, Music2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from 'canvas-confetti';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';

const birthdayMusic = new Howl({
  src: ["../../lib/sanamterikasam.mp3"],  
  loop: true,
});

const messages = [
  "You light up every room you enter! 💫",
  "Your smile is contagious! 😊",
  "You're amazing just the way you are! ✨",
  "Keep shining bright! 🌟",
  "You make the world better! 🌈",
  "You're truly one of a kind! 💝"
];

const BirthdayCard = () => {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(true);
  const [showCake, setShowCake] = useState(false);
  const [balloons, setBalloons] = useState(Array(6).fill(false));
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [giftUnwrapped, setGiftUnwrapped] = useState(false);
  const [currentTab, setCurrentTab] = useState('card');
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF69B4', '#9370DB', '#00CED1'],
      ticks: 200,
      gravity: 0.8,
      scalar: 1.2,
      shapes: ['star', 'circle']
    });
  }, []);

  useEffect(() => {
    // Initial confetti burst when component mounts
    triggerConfetti();
  }, [triggerConfetti]);

  useEffect(() => {
    if (!isMuted) {
      birthdayMusic.play();
    } else {
      birthdayMusic.pause();
    }
    return () => birthdayMusic.stop();
  }, [isMuted]);

  useEffect(() => {
    if (candlesBlown && isRedirecting) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/wishes');
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [candlesBlown, isRedirecting, router]);

  const popBalloon = (index: number) => {
    const newBalloons = [...balloons];
    newBalloons[index] = true;
    setBalloons(newBalloons);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Happy Birthday Angiee! 🎉",
          text: "Join me in celebrating Angiee's birthday!",
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleCakeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!candlesBlown) {
      setCandlesBlown(true);
      setIsRedirecting(true);
      triggerConfetti();
    }
  };

  const TabButton = ({ icon: Icon, label, tab }: { icon: any, label: string, tab: string }) => (
    <Button
      variant={currentTab === tab ? "default" : "ghost"}
      className="flex items-center gap-2"
      onClick={() => setCurrentTab(tab)}
    >
      <Icon size={20} />
      {label}
    </Button>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100 via-purple-200 to-indigo-200 p-4 sm:p-8">
      <canvas 
        ref={canvasRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 50
        }}
      />
      
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2">
            <TabButton icon={Cake} label="Card" tab="card" />
            <TabButton icon={Camera} label="Memories" tab="memories" />
            <TabButton icon={Music2} label="Playlist" tab="playlist" />
            <Link href="/wishes" className="inline-flex">
              <Button variant="ghost" className="flex items-center gap-2">
                <MessageCircle size={20} />
                Birthday Wishes
              </Button>
            </Link>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="bg-white/30 backdrop-blur-sm hover:bg-white/40"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="bg-white/30 backdrop-blur-sm hover:bg-white/40"
            >
              <Share2 size={24} />
            </Button>
          </div>
        </div>

        {currentTab === 'card' && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, type: "spring" }}
              className="text-center mb-16"
            >
              <h1 className="text-6xl sm:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500">
                Happy Birthday
              </h1>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-5xl sm:text-7xl font-bold text-rose-500 mb-4"
              >
                Angelica! 🎉
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-2xl text-purple-600 font-light"
              >
                Today is your special day! ✨
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <motion.div
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="https://i.ibb.co/G3sY0T3w/Screenshot-2025-02-20-230530.png"
                  alt="Birthday celebration image"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
              </motion.div>

              <div className="flex flex-col justify-center gap-4">
                <motion.div
                  className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                    <p className="text-xl leading-relaxed text-purple-900">
                    Priye Angelica,<br /><br />
                    Janmadin mubarak ho! Tumhare bina duniya shayad zyada shaant aur sorted hoti, lekin fir itna drama, adventure aur "maine kya kiya?!" moments kahan se aate? Tumhari khaas skills—cheezon ko samne rakhkar kho dena, chhoti si baat ko maha-episode bana dena, aur sabko bina maange apni kahani sunnana—waaqai bejod hain.<br /><br />
                    Is saal tumhe kam naye musibat wale ideas, thodi aur samajhdari, aur shayad timely replies karne ki taqat mile. Tum duniya ki sari khushiyan, hasi-mazaak, aur kabhi-kabhi ek reality check deserve karti ho.<br /><br />
                    Pyar (aur thodi himmat) ke saath,<br />
                    Tumhare parivaar aur dost 💝
                    </p>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  onClick={() => setShowGift(true)}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold"
                >
                  <Gift size={24} />
                  Open Your Gift!
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-12">
              {balloons.map((isPopped, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 0 }}
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.2 
                  }}
                  onClick={() => !isPopped && popBalloon(index)}
                  className={`cursor-pointer text-center ${isPopped ? 'opacity-0' : ''}`}
                >
                  <div className="text-7xl sm:text-8xl">🎈</div>
                  {isPopped && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-lg font-medium text-purple-700 mt-2"
                    >
                      {messages[index]}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="text-center space-x-4">
              <Button
                onClick={() => setShowCake(!showCake)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-6 rounded-full shadow-lg"
              >
                <Cake className="mr-2 h-6 w-6" /> Make a Birthday Wish!
              </Button>
            </div>
          </>
        )}

        {currentTab === 'memories' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-purple-900 mb-6">Birthday Memories 📸</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "https://i.ibb.co/fdnFxgqC/Screenshot-2025-02-20-230629.png",
                "https://i.ibb.co/JW1Lq2Tc/IMG-20250220-WA0068.jpg",
                "https://i.ibb.co/9992xBd9/IMG-20250220-WA0067.jpg",
                "https://i.ibb.co/RkTZk6Lk/IMG-20250220-WA0080.jpg",
                "https://i.ibb.co/BVfcLsPB/IMG-20250220-WA0070.jpg",
                "https://i.ibb.co/pCFvBGw/IMG-20250220-WA0079.jpg"
              ].map((url, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative aspect-square rounded-lg overflow-hidden"
                >
                  <Image
                    src={`${url}?auto=format&fit=crop&w=800&q=80`}
                    alt={`Memory ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'playlist' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-purple-900 mb-6">Birthday Playlist 🎵</h2>
            <div className="space-y-4">
              {[
                "Happy - Pharrell Williams",
                "Birthday - Katy Perry",
                "Can't Stop the Feeling! - Justin Timberlake",
                "Celebration - Kool & The Gang",
                "Good as Hell - Lizzo",
                "Walking on Sunshine - Katrina & The Waves"
              ].map((song, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-purple-900">{song}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Music2 size={20} />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {showCake && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowCake(false)}
            >
              <motion.div
                className="text-center bg-white/20 backdrop-blur-md rounded-3xl p-12"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  className="cursor-pointer"
                  onClick={handleCakeClick}
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <div className="text-[150px]">{candlesBlown ? "🎂" : "🎈🎂🎈"}</div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 space-y-4"
                  >
                    <div className="text-3xl font-bold text-white">
                      {candlesBlown ? (
                        <>
                          <div>Your wish has been made! ✨</div>
                          <div className="text-2xl mt-4">
                            Redirecting to wishes page in {countdown}...
                          </div>
                        </>
                      ) : (
                        "Click the cake to blow out the candles!"
                      )}
                      <Stars className="inline-block ml-2 text-yellow-300" />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {showGift && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowGift(false)}
            >
              <motion.div
                className="text-center bg-white/20 backdrop-blur-md rounded-3xl p-12"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  className="cursor-pointer"
                  onClick={() => !giftUnwrapped && setGiftUnwrapped(true)}
                  animate={giftUnwrapped ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  } : {}}
                >
                  <div className="text-[150px]">{giftUnwrapped ? "🎁" : "🎁"}</div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 text-3xl font-bold text-white"
                  >
                    {giftUnwrapped ? (
                      "A special surprise awaits you! Check your email 📧"
                    ) : (
                      "Click to unwrap your gift!"
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BirthdayCard;