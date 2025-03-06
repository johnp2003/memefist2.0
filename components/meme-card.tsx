"use client";

import { useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageSquare, Share2, Tag } from "lucide-react";
import { Meme } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

// Load ABI from config
const abi = require("@/config/abi.json");
const contractAddress = "0x50c89cbc4Bde6D08f3f7624B422A9dEff9cCB772";

interface MemeCardProps {
  meme: Meme;
  showCategory?: boolean;
}

export default function MemeCard({ meme, showCategory = false }: MemeCardProps) {
  const [upvotes, setUpvotes] = useState(Number(meme.upvotes));
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = async () => {
    if (!window.ethereum) {
      alert("Please install Metamask!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const userAddress = await signer.getAddress(); // Get the connected user's address
      const memeInfo = await contract.getMemeInfo(meme.id); // Fetch meme details

      const creatorAddress = memeInfo[0]; // Assuming first return value is the creator address

      if (userAddress.toLowerCase() === creatorAddress.toLowerCase()) {
        alert("You cannot upvote your own meme!");
        return;
      }

      const tx = await contract.upvoteMeme(meme.id);
      await tx.wait(); // Wait for transaction confirmation

      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
    } catch (error) {
      console.error("Upvote failed:", error);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(meme.timestamp), { addSuffix: true });

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-4 pb-2 space-y-0">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={meme.creator.avatar || "/sol-col.png"} alt={meme.creator.username} />
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{meme.creator.username}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold mt-2">{meme.title}</h3>
        <span className="text-sm font-light mt-2">{meme.description}</span>
        <div className="mt-1 flex flex-wrap gap-2">
          {showCategory && <Badge variant="secondary" className="text-xs">{meme.category}</Badge>}
          {meme.isNft && <Badge variant="outline" className="bg-primary/10 text-primary text-xs"><Tag className="h-3 w-3 mr-1" />NFT</Badge>}
          {meme.isNft && meme.listed && <Badge variant="outline" className="bg-green-500/10 text-green-500 text-xs">{meme.nftPrice} ETH</Badge>}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image src={meme.imageUrl} alt={meme.title} fill className="object-cover" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={handleUpvote} className={hasUpvoted ? "text-primary" : ""}>
            <ThumbsUp className="h-4 w-4 mr-1" />
            {upvotes}
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm"><MessageSquare className="h-4 w-4 mr-1" />Comment</Button>
          <Button variant="ghost" size="sm"><Share2 className="h-4 w-4 mr-1" />Share</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
