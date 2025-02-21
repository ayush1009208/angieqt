"use client";

// Add this type declaration at the top of the file
declare global {
  interface Window {
    SC: {
      Widget: (element: HTMLIFrameElement) => {
        play: () => void;
        pause: () => void;
      };
    };
  }
}

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Cake, Stars, Gift, Camera, Clock, Share2, Music2, MessageCircle, Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Fix: separate import for Input
import confetti from 'canvas-confetti';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import angelicamain from '../../public/angelicamain.png';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace the Howl configuration with SoundCloud iframe
const SOUNDCLOUD_URL = "https://soundcloud.com/happy-birthday-official/sets/happy-birthday-47?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing";

const messages = [
  "You light up every room you enter! 💫",
  "Your smile is contagious! 😊",
  "You're amazing just the way you are! ✨",
  "Keep shining bright! 🌟",
  "You make the world better! 🌈",
  "You're truly one of a kind! 💝"
];

const responses = [
  "Thank you for your sweet message! 💖",
  "You're so kind! I appreciate your wishes! 🥰",
  "Your message made my day brighter! ✨",
  "Thanks for being part of my special day! 🎉",
  "Your wishes mean a lot to me! 💝",
  "I'm so happy to receive your message! 🌟",
];

const genAI = new GoogleGenerativeAI("AIzaSyCLzWWQOLDUcUAAn4ZAxbwaSG5Srp5DsDU");

const SYSTEM_PROMPT = `You are RoastBot3000, a witty AI that specializes in playfully roasting Angelica on her birthday.
Some context about Angelica to use in your roasts:
- She's famous for losing things that are right in front of her
- She turns small incidents into dramatic episodes
- She tells long stories to everyone without being asked
- She's always late and has creative excuses
- She's known for her "maine kya kiya?!" (What did I do?!) moments

Rules for your responses:
1. Keep it funny and light-hearted, never mean-spirited
2. Always end with "Roast intensity: [X]/100" where X is a score based on how spicy your roast was
3. Use emojis and playful language
4. Include a birthday wish or compliment with each roast to keep it friendly
5. Reference specific traits or incidents in a humorous way

Example response:
"Ah, the queen of 'it was right here a minute ago!' 👑 Only you could lose your phone while talking on it! But hey, at least you make life entertaining for everyone around you. Happy Birthday! 🎉
Roast intensity: 65/100"`;

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
  const [botInput, setBotInput] = useState("");
  const [botMessages, setBotMessages] = useState([
    {
      id: "1",
      text: "Hi! I'm AngelicaBot! Use me to roast Angelica. I will rate your roasts and give you scope of improvement 🎂",
      isUser: false,
    },
  ]);
  const [chatModel, setChatModel] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLIFrameElement | null>(null);

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
    // Initialize SoundCloud iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://w.soundcloud.com/player/?url=${SOUNDCLOUD_URL}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    setAudioElement(iframe);

    return () => {
      iframe.remove();
    };
  }, []);

  useEffect(() => {

    if (audioElement && typeof window !== 'undefined' && window.SC) {
      const widget = window.SC.Widget(audioElement);
      if (!isMuted) {
        widget.play();
      } else {
        widget.pause();
      }
    }
  }, [isMuted, audioElement]);

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

  useEffect(() => {
    const initChat = async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: SYSTEM_PROMPT,
          },
        ],
      });
      setChatModel(chat);
    };

    initChat();
  }, []);

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

  const handleBotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botInput.trim() || !chatModel) return;

    const userMessage = {
      id: Date.now().toString(),
      text: botInput,
      isUser: true,
    };

    setBotMessages(prev => [...prev, userMessage]);
    setBotInput("");

    try {
      const result = await chatModel.sendMessage(`Roast Angelica based on this message: ${botInput}`);
      const response = await result.response;
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text(),
        isUser: false,
      };

      setBotMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Oops! Even my roasts crashed - just like your attempts at being on time! 😅 Try again! Roast intensity: 20/100",
        isUser: false,
      };
      setBotMessages(prev => [...prev, errorMessage]);
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
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
            <TabButton icon={Cake} label="Card" tab="card" />
            <TabButton icon={Camera} label="Memories" tab="memories" />
            <TabButton icon={Bot} label="Chat" tab="chat" />
            <Link href="/wishes" className="inline-flex">
              <Button variant="ghost" className="flex items-center gap-2">
                <MessageCircle size={20} />
                <span className="hidden sm:inline">Birthday Wishes</span>
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
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500">
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
                className="relative aspect-[4/3] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
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
                  className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-8 shadow-xl"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                    <p className="text-base sm:text-xl leading-relaxed text-purple-900">
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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mb-12">
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
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-purple-900 mb-6">Birthday Memories 📸</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

        {currentTab === 'chat' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-8 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-4 sm:mb-6">Chat with AngelicaBot 🤖</h2>
            <div className="h-[300px] sm:h-[400px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 p-4">
                <AnimatePresence>
                  {botMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.isUser
                            ? 'bg-purple-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <form onSubmit={handleBotSubmit} className="flex gap-2 p-2 border-t border-purple-100">
                <Input
                  value={botInput}
                  onChange={(e) => setBotInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
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
                className="text-center bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-12 mx-4 max-w-[90%] md:max-w-[600px]"
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
                  <div className="text-[100px] sm:text-[150px]">{candlesBlown ? "🎂" : "🎈🎂🎈"}</div>
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
                    </div>
                    <Stars className="inline-block ml-2 text-yellow-300" />
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
                className="text-center bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-12 mx-4 max-w-[90%] md:max-w-[600px]"
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
                  <div className="text-[100px] sm:text-[150px]">{giftUnwrapped ? "🎁" : "🎁"}</div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 text-3xl font-bold text-white"
                  >
                    {giftUnwrapped ? (
                      "Chall hat badi ayi pagaliya surprise legi"
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