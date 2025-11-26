import { Card } from "@/components/ui/card";

export const ExplainerVideo = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-xl border-2">
            <video
              controls
              className="w-full aspect-video"
              poster="/placeholder.svg"
            >
              <source src="/videos/explainer.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Card>
        </div>
      </div>
    </section>
  );
};
