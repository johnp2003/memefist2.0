"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MemeCard from "@/components/meme-card";
import { getBattlesByCategory, getMemesByCategory } from "@/lib/mockData";
import { Battle, Meme } from "@/lib/types";
import { Trophy, Calendar, Users, Clock, Swords } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function BattlePage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const [battle, setBattle] = useState<Battle | null>(null);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const fetchedBattles = getBattlesByCategory(category);
      const fetchedMemes = getMemesByCategory(category);
      setBattle(fetchedBattles[0] || null);
      setMemes(fetchedMemes);
      setLoading(false);
    }, 500);
  }, [category]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeRemaining = (endDate: string) => {
    return formatDistanceToNow(new Date(endDate), { addSuffix: false });
  };

  const handleJoinBattle = () => {
    router.push(`/submit`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-lg">Loading battle data...</p>
        </div>
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 capitalize">{category} Battle</h1>
          <p className="text-lg text-muted-foreground mb-8">No active battle found in this category</p>
          <Button onClick={() => router.push('/categories')}>
            Browse Other Categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 capitalize">{category} Meme Battle</h1>
        <span className="text-muted-foreground">Join the battle and showcase your best memes</span>
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">{battle.title}</CardTitle>
          <CardDescription>
            <div className="flex flex-wrap items-center mt-4 gap-4">
              <span className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                Started: {formatDate(battle.startDate)}
              </span>
              <span className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {getTimeRemaining(battle.endDate)} remaining
              </span>
              <span className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-1" />
                {battle.memes.length} entries
              </span>
              <span className="flex items-center text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">
                <Trophy className="h-4 w-4 mr-1" />
                Prize: {battle.prizePool} ETH
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            size="lg" 
            className="w-full sm:w-auto" 
            onClick={handleJoinBattle}
          >
            <Swords className="h-5 w-5 mr-2" />
            Join Battle
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Battle Entries</h2>
        {memes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <MemeCard key={meme.id} meme={meme} showCategory={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <span className="block text-lg text-muted-foreground mb-4">No entries yet. Be the first to join!</span>
            <Button onClick={handleJoinBattle}>Be the first!</Button>
          </div>
        )}
      </div>
    </div>
  );
}