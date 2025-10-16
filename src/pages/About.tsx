import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { X, Volume2, Pause, Play } from "lucide-react";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import team4 from "@/assets/team-4.jpg";
import team5 from "@/assets/team-5.jpg";
import team6 from "@/assets/team-6.jpg";

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

const About = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [speechState, setSpeechState] = useState<{ [key: number]: { speaking: boolean; paused: boolean } }>({});

  const teamMembers = [
    { name: "Mohammad Alalouh", role: "Developer", image: team1, bio: "Leading our conservation efforts with over 15 years of experience in environmental protection." },
    { name: "Dr. James Wilson", role: "Chief Conservation Scientist", image: team2, bio: "Researching forest ecosystems and developing evidence-based conservation strategies." },
    { name: "Sarah Patel", role: "Education Coordinator", image: team3, bio: "Inspiring the next generation through engaging environmental education programs." },
    { name: "Alex Rodriguez", role: "Wildlife Specialist", image: team4, bio: "Protecting endangered species and monitoring biodiversity across our conservation areas." },
    { name: "Robert Thompson", role: "Field Operations Manager", image: team5, bio: "Managing on-ground conservation projects and coordinating volunteer activities." },
    { name: "Emily Davis", role: "Community Outreach Lead", image: team6, bio: "Building partnerships with local communities to promote sustainable forest management." },
  ];

  // Stop TTS on route change
  useEffect(() => {
    TTSManager.stop();
    setSpeechState({});
  }, [location]);

  // Stop TTS on tab change or when leaving the page
useEffect(() => {
  const stopTTS = () => TTSManager.stop();

  const handleVisibility = () => {
    if (document.hidden) stopTTS();
  };

  const handleBeforeUnload = () => stopTTS();

  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("beforeunload", handleBeforeUnload);

  // Stop TTS on route change or unmount
  stopTTS();

  return () => {
    stopTTS(); // Cleanup on unmount
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Thank you for your feedback! We'll be in touch soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Mission & Vision */}
        <section className="mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">About Us</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-medium">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-primary">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To protect and restore woodland ecosystems through science-based conservation, 
                  community engagement, and sustainable practices. We are committed to preserving 
                  biodiversity, mitigating climate change, and ensuring that future generations 
                  can experience the beauty and benefits of healthy forests.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-medium">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-primary">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A world where thriving forests and woodlands are valued, protected, and 
                  sustainably managed for the benefit of all life on Earth. We envision resilient 
                  ecosystems where wildlife flourishes, communities prosper, and nature's 
                  invaluable services are recognized and preserved.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Members */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => {
              const isSpeaking = speechState[index]?.speaking || false;
              const isPaused = speechState[index]?.paused || false;

              const handleSpeak = () => {
                TTSManager.stop(); // Stop any other ongoing speech
                setSpeechState({});
                TTSManager.speak(`${member.name}. ${member.role}. ${member.bio}`, () => {
                  setSpeechState(prev => ({ ...prev, [index]: { speaking: false, paused: false } }));
                });
                setSpeechState(prev => ({ ...prev, [index]: { speaking: true, paused: false } }));
              };

              const handlePause = () => {
                TTSManager.pause();
                setSpeechState(prev => ({ ...prev, [index]: { speaking: true, paused: true } }));
              };

              const handleResume = () => {
                TTSManager.resume();
                setSpeechState(prev => ({ ...prev, [index]: { speaking: true, paused: false } }));
              };

              const handleStop = () => {
                TTSManager.stop();
                setSpeechState(prev => ({ ...prev, [index]: { speaking: false, paused: false } }));
              };

              return (
                <Card key={index} className="overflow-hidden shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                  <div className="relative cursor-pointer">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover"
                      onClick={() => setModalImage(member.image)}
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button size="icon" variant="outline" onClick={handleSpeak}><Volume2 className="w-5 h-5" /></Button>
                      {isSpeaking && !isPaused && <Button size="icon" variant="outline" onClick={handlePause}><Pause className="w-5 h-5" /></Button>}
                      {isPaused && <Button size="icon" variant="outline" onClick={handleResume}><Play className="w-5 h-5" /></Button>}
                      {isSpeaking && <Button size="icon" variant="outline" onClick={handleStop}><X className="w-5 h-5" /></Button>}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-accent font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Modal for full image */}
        {modalImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="relative">
              <img src={modalImage} alt="Full view" className="max-h-[90vh] max-w-[90vw] object-contain" />
              <Button size="icon" variant="outline" className="absolute top-2 right-2 text-white" onClick={() => setModalImage(null)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        )}

        {/* Feedback Form */}
        <section className="mb-16">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-medium">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Share Your Feedback</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your.email@example.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Share your thoughts with us..." rows={5} className="mt-1" />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-forest text-primary-foreground">Submit Feedback</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
