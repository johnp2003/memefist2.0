"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MemeCard from "@/components/meme-card";
import { getBattlesByCategory, getMemesByCategory } from "@/lib/mockData";
import { Battle, Meme } from "@/lib/types";
import { Trophy, Calendar, Users, Clock, Upload } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function BattlePage() {
  const params = useParams();
  const category = params.category as string;
  const [battles, setBattles] = useState<Battle[]>([]);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const fetchedBattles = getBattlesByCategory(category);
      const fetchedMemes = getMemesByCategory(category);
      setBattles(fetchedBattles);
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading battle data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2 capitalize">
          {category === "all" ? "All Battles" : `${category} Meme Battle`}
        </h1>
        <p className="text-muted-foreground mb-6">
          Vote for your favorite memes and help crown the champion
        </p>
        <Link href="/submit">
          <Button size="lg">
            <Upload className="h-4 w-4 mr-2" />
            Submit Your Meme
          </Button>
        </Link>
      </div>

      {category !== "all" && battles.length > 0 && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>{battles[0].title}</CardTitle>
            <CardDescription>
              <div className="flex flex-wrap items-center mt-2 gap-4">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Started: {formatDate(battles[0].startDate)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{getTimeRemaining(battles[0].endDate)} remaining</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{battles[0].memes.length} entries</span>
                </div>
                <div className="flex items-center text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span>Prize: {battles[0].prizePool} ETH</span>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Tabs defaultValue="memes" className="mb-12">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          {category === "all" && <TabsTrigger value="battles">Active Battles</TabsTrigger>}
          <TabsTrigger value="memes">{category === "all" ? "All Memes" : "Battle Entries"}</TabsTrigger>
        </TabsList>
        
        {category === "all" && (
          <TabsContent value="battles" className="mt-6">
            {battles.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {battles.map((battle) => (
                  <Card key={battle.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{battle.title}</CardTitle>
                      <CardDescription>
                        <div className="flex flex-wrap items-center mt-2 gap-4">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{getTimeRemaining(battle.endDate)} remaining</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-1" />