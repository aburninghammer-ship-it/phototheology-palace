import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  location?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "My spiritual 'pilot light' had gone out, and this teaching helped ignite it again.",
    author: "P.S.",
    location: "New York"
  },
  {
    quote: "I've never heard any pastor teach like this. I was born into the church—and this is on another level.",
    author: "R.C.",
    location: "Australia"
  },
  {
    quote: "Phototheology has totally shifted how I study. The visualization tools speak directly to how my mind works—it feels like the Bible finally comes alive.",
    author: "R.T."
  },
  {
    quote: "I'm in love with the Phototheology method—it's the blueprint to life.",
    author: "T.D."
  },
  {
    quote: "This was transforming—life changing. You can't help but fall in love with God all over again.",
    author: "Z.D."
  },
  {
    quote: "There's so much depth in Phototheology that I find myself going back to the beginning just to take it in slowly.",
    author: "A."
  },
  {
    quote: "This connected the whole Bible for me. It's all connected.",
    author: "A.K."
  },
  {
    quote: "I wish there was a study group for this—it helps me connect the rooms and understand it so much more deeply.",
    author: "S.B."
  },
  {
    quote: "This has truly been a blessing. We're on a beautiful journey.",
    author: "B.D."
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
