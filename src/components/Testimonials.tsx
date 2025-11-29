import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  location?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "This is the type of joy and excitement I've always yearned for when studying the Word. These workshops are so fire! You'll be blessed by the way the Spirit shows up in each training.",
    author: "Jessica"
  },
  {
    quote: "Phototheology is a new systematic way for me to approach the Word. It helps me organize my thoughts, gives me the confidence to study with just the Holy Spirit, the Word, and me. No need for pre-made lessons.",
    author: "Rick"
  },
  {
    quote: "While in class the Holy Spirit showed me the image of Christ even before Pastor Ivor explained it! I thank The Lord for Phototheology.",
    author: "Mitchell"
  },
  {
    quote: "Photo-Theology has been a game changer in my personal Bible studies and sermon preparations. It constantly reminds me that the scriptures are divinely inspired.",
    author: "Teddy"
  },
  {
    quote: "The system of Phototheology is literally mind blowing! It has helped me see and understand Jesus more clearly, specifically in terms of His character and His role in prophecy.",
    author: "Theo"
  },
  {
    quote: "I'm in love with the Photo-Theology method—it's the blueprint to life.",
    author: "Toccara"
  },
  {
    quote: "This was transforming—life changing. You can't help but fall in love with God all over again.",
    author: "Ziyanda"
  },
  {
    quote: "There's so much depth in Phototheology that I find myself going back to the beginning just to take it in slowly.",
    author: "Alan"
  },
  {
    quote: "This connected the whole Bible for me. It's all connected.",
    author: "Akila"
  }
];

export const Testimonials = () => {
  return (
    <div className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Students Are Saying</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real testimonials from Phototheology students around the world
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background/50 backdrop-blur">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary mb-4 opacity-50" />
                <p className="text-sm mb-4 italic">"{testimonial.quote}"</p>
                <div className="text-xs text-muted-foreground">
                  <p className="font-semibold">— {testimonial.author}</p>
                  {testimonial.location && (
                    <p className="text-xs mt-1">{testimonial.location}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
