import { useState } from "react";
import { MessageSquare, X, Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config";

export function ReviewWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    content: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role || !formData.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, role, and review",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          company: formData.company,
          content: formData.content,
          rating: rating,
          active: false, // Set to false so admin can review before publishing
          order: 999
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Thank you!",
          description: "Your review has been submitted and will be published after review.",
        });
        setFormData({ name: '', role: '', company: '', content: '' });
        setRating(5);
        setIsOpen(false);
      } else {
        toast({
          title: "Submission Failed",
          description: data.message || "Failed to submit review",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-black text-white rounded-full p-3 md:p-4 shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center gap-2 group"
        >
          <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm md:text-base">
            Leave a Review
          </span>
        </button>
      )}

      {/* Review Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-50 flex items-end md:items-start justify-center md:justify-end p-4 md:p-0 bg-black/50 md:bg-transparent">
          <Card className="shadow-2xl border-2 border-black w-full max-w-md md:max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between bg-black text-white sticky top-0 z-10">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                Share Your Experience
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6">
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">Your Rating *</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 md:w-8 md:h-8 ${
                            star <= (hoveredRating || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">Your Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    disabled={isSubmitting}
                    required
                    className="text-sm md:text-base"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">Your Role *</label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="CEO, Founder, Manager, etc."
                    disabled={isSubmitting}
                    required
                    className="text-sm md:text-base"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">Company (Optional)</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your Company Name"
                    disabled={isSubmitting}
                    className="text-sm md:text-base"
                  />
                </div>

                {/* Review Content */}
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-2">Your Review *</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Share your experience with us..."
                    rows={4}
                    disabled={isSubmitting}
                    required
                    className="text-sm md:text-base"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-black/90 text-sm md:text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your review will be published after verification
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
