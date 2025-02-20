"use client";

// ...existing imports...

const birthdayMusic = new Howl({
  src: ["/lib/sanamterikasam.mp3"],  // Using the local audio file from lib folder
  loop: true,
});

// ...existing code...

<motion.div
  className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.3 }}
>
  <Image
    src="/Angelicamain.png"
    alt="Birthday celebration image"
    fill
    className="object-cover"
    priority
  />