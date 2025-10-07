import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Settings, Star } from 'lucide-react';

interface CustomCourseCardProps {
  onViewDetails: () => void;
}

export default function CustomCourseCard({ onViewDetails }: CustomCourseCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative ring-2 ring-orange-500 ring-offset-2">
      {/* Custom Badge */}
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-10">
        <Star className="w-3 h-3 fill-white" />
        Custom
      </div>

      <CardHeader className="pb-3">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
          Custom Course
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Select the driving skills you consider in-demand
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Flexible hours</span>
          </div>
          <div className="font-bold text-lg text-primary">£30/hour</div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">What you can learn:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              Choose from 20 UK practical driving skills
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              Manoeuvres, safety, and vehicle control
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              Pay only for skills you need
            </li>
            <li className="text-primary font-medium">
              +17 more specialized skills available
            </li>
          </ul>
        </div>

        <Button 
          onClick={onViewDetails} 
          className="w-full group-hover:bg-primary/90 transition-colors bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
        >
          View Details & Book
        </Button>
      </CardContent>
    </Card>
  );
}