import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote: "My spiritual 'pilot light' had gone out, and this teaching helped ignite it again.",
    author: "Paul",
    role: "New York",
  },
  {
    quote: "I've never heard any pastor teach like this. I was born into the church—and this is on another level.",
    author: "Roven",
    role: "Australia",
  },
  {
    quote: "Phototheology has totally shifted how I study. The visualization tools speak directly to how my mind works—it feels like the Bible finally comes alive.",
    author: "Renee",
    role: "Bible Student",
  },
  {
    quote: "This is the type of joy and excitement I've always yearned for when studying the Word. These workshops are so fire!",
    author: "Jessica",
    role: "Student",
  },
  {
    quote: "The system of Phototheology is literally mind blowing! It has helped me see and understand Jesus more clearly.",
    author: "Theo",
    role: "Bible Student",
  },
  {
    quote: "Photo-Theology has been a game changer in my personal Bible studies and sermon preparations.",
    author: "Teddy",
    role: "Pastor",
  },
  {
    quote: "Phototheology is a new systematic way for me to approach the Word. It gives me confidence to study with just the Holy Spirit, the Word, and me.",
    author: "Rick",
    role: "Bible Student",
  },
  {
    quote: "While in class the Holy Spirit showed me the image of Christ even before Pastor Ivor explained it! I thank The Lord for Phototheology.",
    author: "Mitchell",
    role: "Student",
  },
  {
    quote: "I'm in love with the Photo-Theology method—it's the blueprint to life.",
    author: "Toccara",
    role: "Student",
  },
  {
    quote: "This was transforming—life changing. You can't help but fall in love with God all over again.",
    author: "Ziyanda",
    role: "Student",
  },
  {
    quote: "There's so much depth in Phototheology that I find myself going back to the beginning just to take it in slowly.",
    author: "Alan",
    role: "Bible Student",
  },
  {
    quote: "This connected the whole Bible for me. It's all connected.",
    author: "Akila",
    role: "Student",
  },
  {
    quote: "This truly has been a powerful class! The insights and connections are so powerful I keep chewing on them long after.",
    author: "Lorna",
    role: "Student",
  },
  {
    quote: "This is beautiful. The way these concepts unfold lights up Scripture in a new way.",
    author: "Sofia",
    role: "Bible Student",
  },
  {
    quote: "No sleep tonight, Bible all night! This study has truly blessed me.",
    author: "Jenny",
    role: "Student",
  },
];

export const StreamlinedTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getVisibleTestimonials = () => {
    const indices = [];
    for (let i = 0; i < 3; i++) {
      indices.push((currentIndex + i) % testimonials.length);
    }
    return indices;
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          What Students Are Saying
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-12">
          Real testimonials from Phototheology students around the world
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {getVisibleTestimonials().map((index, position) => (
            <Card 
              key={`${index}-${position}`} 
              className={cn(
                "border-2 transition-all duration-500 ease-in-out",
                "animate-fade-in"
              )}
            >
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary mb-4" />
                <p className="text-muted-foreground italic mb-6">
                  "{testimonials[index].quote}"
                </p>
                <div>
                  <p className="font-semibold">{testimonials[index].author}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[index].role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentIndex === index 
                  ? "bg-primary w-6" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
