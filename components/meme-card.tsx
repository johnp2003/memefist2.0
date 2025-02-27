"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, Tag } from "lucide-react";
import { Meme } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface MemeCardProps {
  meme: Meme;
  showCategory?: boolean;
}

export default function MemeCard({ meme, showCategory = false }: MemeCardProps) {
  const [upvotes, setUpvotes] = useState(meme.upvotes);
  const [downvotes, setDownvotes] = useState(meme.downvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);

  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes(upvotes - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes(upvotes + 1);
      setHasUpvoted(true);
      if (hasDownvoted) {
        setDownvotes(downvotes - 1);
        setHasDownvoted(false);
      }
    }
  };

  const handleDownvote = () => {
    if (hasDownvoted) {
      setDownvotes(downvotes - 1);
      setHasDownvoted(false);
    } else {
      setDownvotes(downvotes + 1);
      setHasDownvoted(true);
      if (hasUpvoted) {
        setUpvotes(upvotes - 1);
        setHasUpvoted(false);
      }
    }
  };

  const timeAgo = formatDistanceToNow(new Date(meme.timestamp), { addSuffix: true });

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-4 pb-2 space-y-0">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={meme.creator.avatar} alt={meme.creator.username} />
            <AvatarFallback>{meme.creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{meme.creator.username}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold mt-2">{meme.title}</h3>
        <div className="mt-1 flex flex-wrap gap-2">
          {showCategory && (
            <Badge variant="secondary" className="text-xs">
              {meme.category}
            </Badge>
          )}
          {meme.isNft && (
            <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
              <Tag className="h-3 w-3 mr-1" />
              NFT
            </Badge>
          )}
          {meme.isNft && meme.listed && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 text-xs">
              {meme.nftPrice} ETH
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={meme.imageUrl}
            alt={meme.title}
            fill
            className="object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleUpvote}
            className={hasUpvoted ? "text-primary" : ""}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            {upvotes}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDownvote}
            className={hasDownvoted ? "text-destructive" : ""}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
            {downvotes}
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <MessageSquare className="h-4 w-4 mr-1" />
            Comment
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}