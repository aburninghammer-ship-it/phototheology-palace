import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

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
];

export const StreamlinedTestimonials = () => {
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
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary mb-4" />
                <p className="text-muted-foreground italic mb-6">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
