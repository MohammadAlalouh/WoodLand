import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import { toast } from "sonner";

const SiteMap = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const destination = "71 St Pauls Ln, French Village, NS B3Z 2Y1";

  const handleLocateMe = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLoading(false);
      },
      () => {
        toast.error("Unable to access your location. Please enable location services.");
        setLoading(false);
      }
    );
  };

  const mapSrc = coords
    ? `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(destination)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Location & Directions</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          View this location or center the map on your current position.
        </p>

        <div className="mb-6 flex justify-center gap-4 flex-wrap">
          <Button
            onClick={handleLocateMe}
            className="bg-accent text-accent-foreground"
            aria-label="Locate me on the map"
            disabled={loading}
          >
            <Navigation className="w-5 h-5 mr-2" />
            {loading ? "Locating..." : "Locate Me"}
          </Button>

          <Button
            onClick={() => setCoords(null)}
            className="bg-primary text-primary-foreground"
            aria-label="Go to Woodland"
          >
            <Navigation className="w-5 h-5 mr-2" />
            Go to Woodland
          </Button>
        </div>

        <Card className="shadow-strong overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-full h-[400px] md:h-[600px] bg-muted">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteMap;
