"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCategories } from "@/lib/mockData";
import { Upload, Image as ImageIcon, Check } from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function SubmitPage() {
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Check if the user is connected via their wallet
  const { isConnected } = useAccount();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Since the submit button only appears when connected, this check is redundant but kept for safety
    if (!isConnected) {
      return; // Won’t trigger due to conditional rendering
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setTitle("");
        setCategory("");
        setDescription("");
        setFile(null);
        setPreviewUrl(null);
        setIsSubmitted(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit Your Meme</h1>
        <p className="text-muted-foreground">
          Share your best memes with the community and compete for upvotes
        </p>
      </div>

      <Card className="w-full">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Meme Submission</CardTitle>
            <CardDescription>
              Fill out the form below to submit your meme to a battle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Meme Title</Label>
              <Input
                id="title"
                placeholder="Enter a catchy title for your meme"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={setCategory}
                required
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add some context to your meme"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meme-upload">Upload Meme</Label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                {previewUrl ? (
                  <div className="space-y-4 w-full">
                    <div className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-md">
                      <img
                        src={previewUrl}
                        alt="Meme preview"
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl(null);
                        }}
                        disabled={isSubmitting}
                      >
                        Remove Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium">
                        Drag and drop your image here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports JPG, PNG, GIF (Max 5MB)
                      </p>
                    </div>
                    <Input
                      id="meme-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      required
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => document.getElementById("meme-upload")?.click()}
                      disabled={isSubmitting}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {isConnected ? (
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || isSubmitted || !title || !category || !file}
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : isSubmitted ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Submitted Successfully
                  </>
                ) : (
                  <>Submit Meme</>
                )}
              </Button>
            ) : (
              <div className="w-full text-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
                <p className="font-medium">Wallet Not Connected</p>
                <p className="text-sm">
                  Please connect your wallet to submit a meme.
                </p>
                <div className="mt-2 flex justify-center">
                  <ConnectButton 
                    label="Connect Wallet to Submit"
                    showBalance={false}
                    chainStatus="none"
                  />
                </div>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}