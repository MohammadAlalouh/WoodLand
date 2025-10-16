import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Users, Target } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-forest.jpg";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[600px] md:h-[700px] flex items-center justify-center text-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Optional overlay for readability */}
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-white animate-fade-in">
          <div className="px-6 py-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-transparent">
              Welcome to Woodland Conservation
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed bg-transparent">
              Dedicated to preserving our forests, protecting wildlife, and creating a sustainable future for generations to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/about">
                <Button size="lg" variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Learn More
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="secondary">
                  Get Involved
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Highlights */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Conservation Pillars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-medium hover:shadow-strong transition-shadow animate-slide-up">
              <div className="w-14 h-14 bg-gradient-forest rounded-lg flex items-center justify-center mb-4">
                <Leaf className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Forest Preservation</h3>
              <p className="text-muted-foreground">
                Protecting ancient woodlands and restoring degraded forest ecosystems through sustainable management practices.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-medium hover:shadow-strong transition-shadow animate-slide-up [animation-delay:200ms]">
              <div className="w-14 h-14 bg-gradient-earth rounded-lg flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Engagement</h3>
              <p className="text-muted-foreground">
                Empowering local communities through education, volunteer programs, and sustainable livelihood initiatives.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-medium hover:shadow-strong transition-shadow animate-slide-up [animation-delay:400ms]">
              <div className="w-14 h-14 bg-gradient-sky rounded-lg flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Wildlife Protection</h3>
              <p className="text-muted-foreground">
                Safeguarding biodiversity by protecting critical habitats and implementing conservation strategies for endangered species.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Every action counts in protecting our planet's precious woodlands. Discover how you can make a difference today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" className="bg-gradient-forest text-primary-foreground hover:opacity-90">
                Support Through Shop
              </Button>
            </Link>
            <Link to="/gallery">
              <Button size="lg" variant="outline">
                Share Your Nature Photos
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
