import { Navigation } from "@/components/Navigation";
import { PtGlossaryTable } from "@/components/PtGlossaryTable";

const Glossary = () => {
  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      <div className="pt-4 pb-24 md:pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <PtGlossaryTable />
        </div>
      </div>
    </div>
  );
};

export default Glossary;
