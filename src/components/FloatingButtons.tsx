import { MessageCircle, Hand } from "lucide-react";
import { Button } from "./ui/button";

const FloatingButtons = () => {
  return (
    <div className="fixed left-6 bottom-6 flex flex-col gap-4 z-50">
      <Button
        size="icon"
        className="w-14 h-14 rounded-full bg-saudi-green hover:bg-saudi-green-light shadow-lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
      <Button
        size="icon"
        className="w-14 h-14 rounded-full bg-saudi-green hover:bg-saudi-green-light shadow-lg"
      >
        <Hand className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default FloatingButtons;
