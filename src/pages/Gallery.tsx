import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Heart, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface UploadedImage {
  _id: string;
  name: string;
  email: string;
  description: string;
  imageUrl: string;
  likes: number;
  comments: { text: string; timestamp: string }[];
  timestamp: string;
}

const Gallery = () => {
  const [formData, setFormData] = useState({ name: "", email: "", description: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load existing images and normalize data
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("http://localhost:3001/images");
        const images = res.data.map((img: any) => ({
          _id: img.id,
          name: img.name,
          email: img.email,
          description: img.description,
          imageUrl: img.imageUrl,
          likes: img.likes,
          comments: (img.Comments || []).map((c: any) => ({
            text: c.text,
            timestamp: c.timestamp,
          })),
          timestamp: img.createdAt,
        }));
        setUploadedImages(images);
      } catch (err) {
        console.error("Failed to fetch images:", err);
      }
    };
    fetchImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload only image files (.jpg, .jpeg, .png, .gif)");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.description || !selectedFile) {
      toast.error("Please fill in all fields and select an image");
      return;
    }

    if (formData.description.length > 600) {
      toast.error("Description must be at most 600 characters");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("description", formData.description);
    data.append("image", selectedFile);

    setIsUploading(true);
    setUploadProgress(0);
    const toastId = toast.loading("Uploading image...");

    try {
      const res = await axios.post("http://localhost:3001/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percent);
        },
      });

      const newImage: UploadedImage = {
        _id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        description: res.data.description,
        imageUrl: res.data.imageUrl,
        likes: res.data.likes,
        comments: [],
        timestamp: res.data.createdAt,
      };

      setUploadedImages([newImage, ...uploadedImages]);
      toast.success("Image uploaded successfully!", { id: toastId });
      setFormData({ name: "", email: "", description: "" });
      setSelectedFile(null);
      setPreviewUrl("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Upload failed", { id: toastId });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const res = await axios.post(`http://localhost:3001/images/${id}/like`);
      setUploadedImages((prev) =>
        prev.map((img) => (img._id === id ? { ...img, likes: res.data.likes } : img))
      );
    } catch (err) {
      console.error("Failed to like image:", err);
    }
  };

  const handleComment = async (id: string) => {
    if (!commentText[id]) return;
    try {
      const res = await axios.post(`http://localhost:3001/images/${id}/comment`, {
        text: commentText[id],
      });
      setUploadedImages((prev) =>
        prev.map((img) =>
          img._id === id
            ? { ...img, comments: (res.data || []).map((c: any) => ({ text: c.text, timestamp: c.timestamp })) }
            : img
        )
      );
      setCommentText((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Photo Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Share your nature photography with our community.
          </p>
        </div>

        {/* Upload Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="shadow-medium">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Upload Your Nature Photo</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="uploaderName">Your Name</Label>
                  <Input
                    id="uploaderName"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="uploaderEmail">Email Address</Label>
                  <Input
                    id="uploaderEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="uploaderDescription">Photo Description</Label>
                  <Input
                    id="uploaderDescription"
                    type="text"
                    value={formData.description}
                    onChange={(e) => {
                      if (e.target.value.length <= 600) {
                        setFormData({ ...formData, description: e.target.value });
                      }
                    }}
                    placeholder="Describe your photo (max 600 characters)..."
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.description.length}/600 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="imageUpload">Select Image</Label>
                  <Input
                    id="imageUpload"
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={handleFileChange}
                    className="cursor-pointer mt-1"
                  />
                </div>

                {previewUrl && (
                  <div className="mt-4">
                    <Label>Preview</Label>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mt-2 w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-gradient-forest text-primary-foreground"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {isUploading ? `Uploading... ${uploadProgress}%` : "Upload Photo"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Gallery Grid */}
        {uploadedImages.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Community Contributions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedImages.map((image) => (
                <Card
                  key={image._id}
                  className="overflow-hidden shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={`http://localhost:3001${image.imageUrl}`}
                    alt={`Photo by ${image.name}`}
                    className="w-full object-contain cursor-pointer"
                    onClick={() => setModalImage(`http://localhost:3001${image.imageUrl}`)}
                  />
                  <CardContent className="p-4">
                    <p className="font-semibold">{image.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(image.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm italic">{image.description}</p>

                    <div className="flex items-center gap-4 mt-4">
                      <Button size="sm" variant="ghost" onClick={() => handleLike(image._id)}>
                        <Heart className="w-4 h-4 mr-1" />
                        {image.likes}
                      </Button>
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder="Add a comment..."
                          value={commentText[image._id] || ""}
                          onChange={(e) =>
                            setCommentText((prev) => ({ ...prev, [image._id]: e.target.value }))
                          }
                          className="text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => handleComment(image._id)}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Comment
                        </Button>
                      </div>
                    </div>

                    {image.comments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-semibold">Comments:</h4>
                        {image.comments.map((comment, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground border-l-2 pl-2">
                            <p>{comment.text}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(comment.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Full-size Modal */}
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
      </div>
    </div>
  );
};

export default Gallery;
