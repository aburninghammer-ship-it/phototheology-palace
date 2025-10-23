import { Navigation } from "@/components/Navigation";
import { BibleReader } from "@/components/bible/BibleReader";
import { BibleNavigation } from "@/components/bible/BibleNavigation";

const Bible = () => {
  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 bg-gradient-palace bg-clip-text text-transparent">
              Phototheology Bible
            </h1>
            <p className="text-lg text-muted-foreground">
              Scripture through principle lenses
            </p>
          </div>

          {/* Navigation */}
          <div className="mb-8">
            <BibleNavigation />
          </div>

          {/* Bible Reader */}
          <BibleReader />
        </div>
      </div>
    </div>
  );
};

export default Bible;
