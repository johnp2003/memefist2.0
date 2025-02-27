import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Category } from "@/lib/types";
import { Bitcoin, Gamepad2, Cpu, Laugh, Image, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const getIcon = () => {
    switch (category.icon) {
      case 'bitcoin':
        return <Bitcoin className="h-8 w-8" />;
      case 'gamepad-2':
        return <Gamepad2 className="h-8 w-8" />;
      case 'cpu':
        return <Cpu className="h-8 w-8" />;
      case 'laugh':
        return <Laugh className="h-8 w-8" />;
      case 'image':
        return <Image className="h-8 w-8" />;
      default:
        return <Bitcoin className="h-8 w-8" />;
    }
  };

  // Calculate time remaining (mock data - assuming 72 hours from now)
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 72);
  const timeRemaining = formatDistanceToNow(endTime, { addSuffix: false });

  return (
    <Link href={`/battle/${category.name.toLowerCase()}`}>
      <Card className="h-full hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
            {getIcon()}
          </div>
          <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
          
          <div className="bg-accent/50 rounded-lg p-3 w-full mb-4">
            <p className="text-sm font-medium">Prize Pool</p>
            <p className="text-xl font-bold">{(Math.random() * 2 + 0.5).toFixed(2)} ETH</p>
          </div>
          
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{timeRemaining} remaining</span>
          </div>
        </CardContent>
        <CardFooter className="pt-0 pb-6 flex justify-center">
          <div className="text-sm font-medium">
            {category.activeBattles === 1 ? 'Active Battle' : 'Active Battle'}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}