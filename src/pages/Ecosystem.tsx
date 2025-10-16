import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Pause, Play, X, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import streamImage from "@/assets/ecosystem-stream.jpg";
import wildlifeImage from "@/assets/ecosystem-wildlife.jpg";
import oldgrowthImage from "@/assets/ecosystem-oldgrowth.jpg";

// Global TTS Manager
const TTSManager = (() => {
  let currentUtterance: SpeechSynthesisUtterance | null = null;
  return {
    speak(text: string, onEnd?: () => void) {
      window.speechSynthesis.cancel();
      currentUtterance = new SpeechSynthesisUtterance(text);
      currentUtterance.rate = 0.9;
      currentUtterance.pitch = 1;
      currentUtterance.volume = 1;
      currentUtterance.onend = () => {
        currentUtterance = null;
        onEnd?.();
      };
      window.speechSynthesis.speak(currentUtterance);
    },
    pause() {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
      }
    },
    resume() {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    },
    stop() {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    },
    isSpeaking() {
      return window.speechSynthesis.speaking;
    },
    isPaused() {
      return window.speechSynthesis.paused;
    },
  };
})();

const Ecosystem = () => {
  const [speechState, setSpeechState] = useState<{ [key: number]: { speaking: boolean; paused: boolean } }>({});
  const [modalImage, setModalImage] = useState<string | null>(null);

  const ecosystems = [
    {
      title: "Forest Streams",
      image: streamImage,
      description:
        "Crystal-clear streams flowing through our woodlands provide vital habitat for countless species. These waterways support diverse aquatic life, filter nutrients, and connect forest ecosystems. The moss-covered rocks and ferns along the banks create microhabitats essential for amphibians and insects.",
    },
    {
      title: "Wildlife Corridors",
      image: wildlifeImage,
      description:
        "Our forests serve as crucial corridors for wildlife movement, allowing species like deer, bears, and countless birds to migrate safely. These pathways maintain genetic diversity and enable animals to access food, water, and breeding grounds across vast landscapes.",
    },
    {
      title: "Old-Growth Forests",
      image: oldgrowthImage,
      description:
        "Ancient trees in old-growth forests are irreplaceable treasures, some standing for centuries. These giants support complex ecosystems, storing massive amounts of carbon and providing homes for countless organisms. Their preservation is critical for biodiversity and climate stability.",
    },
  ];

  // Stop TTS on tab switch or page unload
  useEffect(() => {
    const stopTTS = () => TTSManager.stop();

    const handleVisibilityChange = () => {
      if (document.hidden) stopTTS();
    };

    const handleBeforeUnload = () => stopTTS();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    stopTTS(); // Stop on mount

    return () => {
      stopTTS(); // Stop on unmount
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleSpeak = (index: number, text: string) => {
    TTSManager.speak(text, () => {
      setSpeechState(prev => ({ ...prev, [index]: { speaking: false, paused: false } }));
    });
    setSpeechState(prev => ({ ...prev, [index]: { speaking: true, paused: false } }));
  };

  const handlePause = (index: number) => {
    TTSManager.pause();
    setSpeechState(prev => ({ ...prev, [index]: { speaking: true, paused: true } }));
  };

  const handleResume = (index: number) => {
    TTSManager.resume();
    setSpeechState(prev => ({ ...prev, [index]: { speaking: true, paused: false } }));
  };

  const handleStop = (index: number) => {
    TTSManager.stop();
    setSpeechState(prev => ({ ...prev, [index]: { speaking: false, paused: false } }));
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Ecosystem</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore the diverse habitats and natural wonders within our conservation areas. 
            Click the speaker icon to hear audio descriptions or enlarge images.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ecosystems.map((eco, index) => {
            const isSpeaking = speechState[index]?.speaking || false;
            const isPaused = speechState[index]?.paused || false;

            return (
              <Card
                key={index}
                className="overflow-hidden shadow-medium hover:shadow-strong transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative group cursor-pointer">
                  <img
                    src={eco.image}
                    alt={eco.title}
                    className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => setModalImage(eco.image)}
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-3 right-3 opacity-80 hover:opacity-100"
                    onClick={() => setModalImage(eco.image)}
                  >
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4 gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold">{eco.title}</h2>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleSpeak(index, `${eco.title}. ${eco.description}`)}
                      >
                        <Volume2 className="w-5 h-5" />
                      </Button>

                      {isSpeaking && !isPaused && (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handlePause(index)}
                        >
                          <Pause className="w-5 h-5" />
                        </Button>
                      )}

                      {isPaused && (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleResume(index)}
                        >
                          <Play className="w-5 h-5" />
                        </Button>
                      )}

                      {isSpeaking && (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleStop(index)}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {eco.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Modal for full-size image */}
        {modalImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-5xl max-h-[90vh]">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-3 right-3 rounded-full bg-white border border-black hover:bg-gray-100 transition-all shadow-md"
                onClick={() => setModalImage(null)}
                aria-label="Close full image"
              >
                <X className="w-5 h-5 text-black" />
              </Button>
              <img
                src={modalImage}
                alt="Full view"
                className="rounded-lg max-h-[90vh] object-contain shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-16 bg-gradient-forest text-primary-foreground p-8 rounded-xl shadow-medium">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Ecosystem Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
                            <h4 className="font-semibold mb-2">Carbon Storage</h4>
              <p className="text-primary-foreground/90">
                Our forests sequester thousands of tons of CO₂ annually
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Water Filtration</h4>
              <p className="text-primary-foreground/90">
                Natural filtration provides clean water for communities
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Biodiversity</h4>
              <p className="text-primary-foreground/90">
                Home to over 500 species of plants and animals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ecosystem;
