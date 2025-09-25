'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Car,
  ChevronLeft, 
  ChevronRight,
  RefreshCw,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Zap,
  Star,
  Users
} from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  instructor?: {
    name: string;
    rating: number;
    avatar: string;
  };
  price: number;
  duration: number; // in minutes
  location: string;
  transmission: 'manual' | 'automatic';
  type: 'regular' | 'intensive' | 'test-prep';
}

interface DaySchedule {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isWeekend: boolean;
  timeSlots: TimeSlot[];
}

export default function AdvancedCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(false);
  const [filterTransmission, setFilterTransmission] = useState<'all' | 'manual' | 'automatic'>('all');
  const [filterType, setFilterType] = useState<'all' | 'regular' | 'intensive' | 'test-prep'>('all');
  const [searchLocation, setSearchLocation] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>([]);
  const [availableSlotsCount, setAvailableSlotsCount] = useState(0);

  // Initialize client-side state and generate mock data for the week
  useEffect(() => {
    setIsClient(true);
    generateWeekSchedule();
  }, [currentDate, filterTransmission, filterType, searchLocation]);

  const generateWeekSchedule = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      const schedule: DaySchedule[] = [];
      let totalAvailable = 0;
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const isToday = date.toDateString() === new Date().toDateString();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        const timeSlots = generateTimeSlotsForDay(date, isWeekend);
        const availableSlots = timeSlots.filter(slot => 
          slot.available && 
          (filterTransmission === 'all' || slot.transmission === filterTransmission) &&
          (filterType === 'all' || slot.type === filterType) &&
          (searchLocation === '' || slot.location.toLowerCase().includes(searchLocation.toLowerCase()))
        );
        
        totalAvailable += availableSlots.length;
        
        schedule.push({
          date,
          dayName: dayName.substring(0, 3),
          dayNumber: date.getDate(),
          isToday,
          isWeekend,
          timeSlots: availableSlots
        });
      }
      
      setWeekSchedule(schedule);
      setAvailableSlotsCount(totalAvailable);
      setIsLoading(false);
    }, 800);
  };

  const generateTimeSlotsForDay = (date: Date, isWeekend: boolean): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = isWeekend ? 9 : 8;
    const endHour = isWeekend ? 18 : 20;
    
    // Return empty array if not on client side to prevent hydration mismatch
    if (!isClient) {
      return slots;
    }
    
    const instructors = [
      { name: 'Sarah Jones', rating: 4.9, avatar: '/api/placeholder/40/40' },
      { name: 'Mike Chen', rating: 4.8, avatar: '/api/placeholder/40/40' },
      { name: 'Emma Wilson', rating: 4.7, avatar: '/api/placeholder/40/40' },
      { name: 'James Taylor', rating: 4.6, avatar: '/api/placeholder/40/40' }
    ];
    
    const locations = ['City Centre', 'North London', 'South London', 'East London', 'West London'];
    const types: ('regular' | 'intensive' | 'test-prep')[] = ['regular', 'intensive', 'test-prep'];
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 60) { // 1-hour slots
        const instructor = instructors[Math.floor(Math.random() * instructors.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        
        slots.push({
          id: `slot-${date.getTime()}-${hour}-${minute}`,
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          available: Math.random() > 0.3, // 70% availability
          instructor,
          price: type === 'intensive' ? 45 : type === 'test-prep' ? 40 : 35,
          duration: type === 'intensive' ? 120 : 60,
          location,
          transmission: Math.random() > 0.5 ? 'manual' : 'automatic',
          type
        });
      }
    }
    
    return slots;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const handleSlotSelect = (slot: TimeSlot, date: Date) => {
    setSelectedSlot(slot);
    setSelectedDate(date);
  };

  const handleBookSlot = () => {
    if (!selectedSlot || !selectedDate) return;
    
    // Simulate booking
    const message = `Hi! I'd like to book a driving lesson:

📅 Date: ${selectedDate.toLocaleDateString()}
⏰ Time: ${selectedSlot.time}
👨‍🏫 Instructor: ${selectedSlot.instructor?.name}
🚗 Transmission: ${selectedSlot.transmission}
📍 Location: ${selectedSlot.location}
💰 Price: £${selectedSlot.price}

Please confirm availability and send booking details.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/447756183484?text=${encodedMessage}`, '_blank');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'intensive': return 'bg-purple-100 text-purple-700';
      case 'test-prep': return 'bg-orange-100 text-orange-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'intensive': return <Zap className="w-3 h-3" />;
      case 'test-prep': return <Star className="w-3 h-3" />;
      default: return <Car className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Advanced Booking Calendar
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Real-time availability • {availableSlotsCount} slots available this week
              </p>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('prev')}
                disabled={isLoading}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="px-4 py-2 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-700">
                  {currentDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })} Week
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('next')}
                disabled={isLoading}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={generateWeekSchedule}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Location Search */}
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Transmission Filter */}
            <select
              value={filterTransmission}
              onChange={(e) => setFilterTransmission(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Transmissions</option>
              <option value="manual">Manual Only</option>
              <option value="automatic">Automatic Only</option>
            </select>
            
            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="regular">Regular Lessons</option>
              <option value="intensive">Intensive Course</option>
              <option value="test-prep">Test Preparation</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {weekSchedule.map((day, dayIndex) => (
          <Card 
            key={day.date.toISOString()}
            className={`transition-all duration-300 ${
              day.isToday 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            } ${
              day.isWeekend ? 'bg-gray-50' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="text-center">
                <div className={`text-sm font-medium ${
                  day.isToday ? 'text-blue-600' : day.isWeekend ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  {day.dayName}
                </div>
                <div className={`text-2xl font-bold ${
                  day.isToday ? 'text-blue-600' : day.isWeekend ? 'text-gray-400' : 'text-gray-900'
                }`}>
                  {day.dayNumber}
                </div>
                {day.isToday && (
                  <Badge className="bg-blue-100 text-blue-700 text-xs">Today</Badge>
                )}
              </div>
              
              {/* Day Summary */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-gray-600">{day.timeSlots.length}</span>
                </div>
                {day.timeSlots.length > 5 && (
                  <Badge variant="outline" className="text-xs">Popular</Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-2 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : day.timeSlots.length > 0 ? (
                day.timeSlots.map((slot, slotIndex) => (
                  <div
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot, day.date)}
                    className={`group p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedSlot?.id === slot.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    {/* Time and Type */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-sm">{slot.time}</span>
                      </div>
                      <Badge className={`text-xs ${getTypeColor(slot.type)} flex items-center gap-1`}>
                        {getTypeIcon(slot.type)}
                        {slot.type}
                      </Badge>
                    </div>
                    
                    {/* Instructor */}
                    {slot.instructor && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-700">
                            {slot.instructor.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">{slot.instructor.rating}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{slot.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Car className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600 capitalize">
                            {slot.transmission}
                          </span>
                        </div>
                        <div className="font-semibold text-sm text-blue-600">
                          £{slot.price}
                        </div>
                      </div>
                    </div>
                    
                    {/* Duration */}
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {slot.duration} minutes
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No slots available</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Slot Details */}
      {selectedSlot && selectedDate && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Selected Lesson Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Lesson Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{selectedSlot.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{selectedSlot.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <Badge className={getTypeColor(selectedSlot.type)}>
                        {selectedSlot.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Instructor</h4>
                  {selectedSlot.instructor && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">{selectedSlot.instructor.name}</div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{selectedSlot.instructor.rating} rating</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedSlot.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transmission:</span>
                      <span className="font-medium capitalize">{selectedSlot.transmission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-lg text-blue-600">£{selectedSlot.price}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleBookSlot}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-3"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Book This Lesson
                  </Button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    You'll be redirected to WhatsApp to confirm booking
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="font-bold text-xl">{availableSlotsCount}</div>
            <div className="text-sm text-gray-600">Available Slots</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="font-bold text-xl">12</div>
            <div className="text-sm text-gray-600">Instructors Online</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="font-bold text-xl">4.8</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="font-bold text-xl">25+</div>
            <div className="text-sm text-gray-600">Locations</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}