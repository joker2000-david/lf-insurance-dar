import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/whatsapp";

const Chatbot = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        className="h-14 w-14 rounded-full shadow-large bg-[#25D366] hover:bg-[#1ebe57] text-white animate-float"
        size="icon"
        type="button"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </a>
  );
};

export default Chatbot;
