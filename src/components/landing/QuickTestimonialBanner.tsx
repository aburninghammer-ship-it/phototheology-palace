import { useEffect, useState } from "react";
import { Star } from "lucide-react";

const quickTestimonials = [
  { quote: "Mind blowing!", author: "Theo" },
  { quote: "A game changer", author: "Teddy, Pastor" },
  { quote: "Life changing", author: "Ziyanda" },
  { quote: "Finally connects the whole Bible", author: "Akila" },
];

export const QuickTestimonialBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out, swap, fade in
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % quickTestimonials.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 bg-primary/10 border-y border-primary/20">
      <div className="flex gap-0.5 flex-shrink-0">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
        ))}
      </div>
      <p
        className="text-sm font-medium text-foreground transition-opacity duration-400"
        style={{ opacity: visible ? 1 : 0 }}
      >
        "{quickTestimonials[currentIndex].quote}" — {quickTestimonials[currentIndex].author}
      </p>
    </div>
  );
};

