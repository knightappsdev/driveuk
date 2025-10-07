'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search, Filter, X } from 'lucide-react';

interface InstructorFilters {
  postcode: string;
  transmission: string;
  ethnicity: string;
  religion: string;
  teachingExpertise: string;
  priceRange: string;
  experience: string;
  carFuelType: string;
}

interface DynamicInstructorFiltersProps {
  onFiltersChange: (filters: InstructorFilters) => void;
  filters: InstructorFilters;
  className?: string;
}

// UK postcode areas for quick selection
const popularPostcodeAreas = [
  { area: 'M', name: 'Manchester', example: 'M1, M13, M20' },
  { area: 'B', name: 'Birmingham', example: 'B1, B21, B42' },
  { area: 'L', name: 'Liverpool', example: 'L1, L18, L25' },
  { area: 'LS', name: 'Leeds', example: 'LS1, LS2, LS6' },
  { area: 'S', name: 'Sheffield', example: 'S1, S10, S17' },
  { area: 'BS', name: 'Bristol', example: 'BS1, BS8, BS16' },
  { area: 'NE', name: 'Newcastle', example: 'NE1, NE4, NE12' },
  { area: 'NG', name: 'Nottingham', example: 'NG1, NG7, NG15' },
  { area: 'LE', name: 'Leicester', example: 'LE1, LE3, LE18' },
  { area: 'EH', name: 'Edinburgh', example: 'EH1, EH10, EH16' },
  { area: 'G', name: 'Glasgow', example: 'G1, G12, G31' },
  { area: 'CF', name: 'Cardiff', example: 'CF1, CF10, CF23' },
  { area: 'BT', name: 'Belfast', example: 'BT1, BT9, BT17' },
  { area: 'BN', name: 'Brighton', example: 'BN1, BN2, BN41' },
  { area: 'OX', name: 'Oxford', example: 'OX1, OX2, OX4' },
  { area: 'CB', name: 'Cambridge', example: 'CB1, CB2, CB4' },
  { area: 'YO', name: 'York', example: 'YO1, YO10, YO24' },
  { area: 'BA', name: 'Bath', example: 'BA1, BA2, BA3' },
  { area: 'CT', name: 'Canterbury', example: 'CT1, CT2, CT4' },
];

// London areas deserve special mention
const londonAreas = [
  { area: 'E', name: 'East London', example: 'E1, E14, E20' },
  { area: 'W', name: 'West London', example: 'W1, W12, W14' },
  { area: 'N', name: 'North London', example: 'N1, N8, N22' },
  { area: 'SW', name: 'South West London', example: 'SW1, SW15, SW19' },
  { area: 'SE', name: 'South East London', example: 'SE1, SE10, SE22' },
  { area: 'NW', name: 'North West London', example: 'NW1, NW3, NW10' },
  { area: 'EC', name: 'East Central London', example: 'EC1, EC2, EC4' },
  { area: 'WC', name: 'West Central London', example: 'WC1, WC2' },
];

export default function DynamicInstructorFilters({ 
  onFiltersChange, 
  filters, 
  className = "" 
}: DynamicInstructorFiltersProps) {
  const [postcodeInput, setPostcodeInput] = useState(filters.postcode);
  const [showPostcodeAreas, setShowPostcodeAreas] = useState(false);

  const updateFilter = (key: keyof InstructorFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handlePostcodeSubmit = () => {
    updateFilter('postcode', postcodeInput.toUpperCase());
  };

  const selectPostcodeArea = (area: string) => {
    setPostcodeInput(area);
    updateFilter('postcode', area);
    setShowPostcodeAreas(false);
  };

  const clearAllFilters = () => {
    setPostcodeInput('');
    onFiltersChange({
      postcode: '',
      transmission: '',
      ethnicity: '',
      religion: '',
      teachingExpertise: '',
      priceRange: '',
      experience: '',
      carFuelType: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Postcode Search */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Find by UK Postcode
              </h4>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-destructive hover:text-destructive/80"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter postcode (e.g., M1 3HZ, SW1A 1AA)"
                  value={postcodeInput}
                  onChange={(e) => setPostcodeInput(e.target.value.toUpperCase())}
                  onFocus={() => setShowPostcodeAreas(true)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePostcodeSubmit()}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <Button onClick={handlePostcodeSubmit} size="sm">
                Search
              </Button>
            </div>

            {/* Selected Postcode Display */}
            {filters.postcode && (
              <div className="p-3 bg-primary/10 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">Area: {filters.postcode}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPostcodeInput('');
                    updateFilter('postcode', '');
                  }}
                  className="text-primary hover:text-primary/80"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Quick Postcode Area Selection */}
            {showPostcodeAreas && !filters.postcode && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-sm">Popular Areas</h5>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPostcodeAreas(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* London Areas */}
                <div>
                  <h6 className="text-xs font-medium text-gray-600 mb-2">London Areas</h6>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {londonAreas.map((area) => (
                      <Button
                        key={area.area}
                        variant="outline"
                        size="sm"
                        onClick={() => selectPostcodeArea(area.area)}
                        className="justify-start p-2 h-auto text-left hover:bg-primary/10"
                      >
                        <div>
                          <div className="font-medium text-xs">{area.area}</div>
                          <div className="text-xs text-muted-foreground">{area.name}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Other UK Areas */}
                <div>
                  <h6 className="text-xs font-medium text-gray-600 mb-2">Other UK Areas</h6>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                    {popularPostcodeAreas.map((area) => (
                      <Button
                        key={area.area}
                        variant="outline"
                        size="sm"
                        onClick={() => selectPostcodeArea(area.area)}
                        className="justify-start p-2 h-auto text-left hover:bg-primary/10"
                      >
                        <div>
                          <div className="font-medium text-xs">{area.area}</div>
                          <div className="text-xs text-muted-foreground">{area.name}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transmission Type */}
          <div className="space-y-3 lg:w-64">
            <h4 className="font-medium text-sm">Transmission Type</h4>
            <div className="grid grid-cols-2 gap-2">
              {['Manual', 'Automatic'].map((type) => (
                <Button
                  key={type}
                  variant={filters.transmission === type.toLowerCase() ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter('transmission', type.toLowerCase())}
                  className="justify-center"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-3 lg:w-64">
            <h4 className="font-medium text-sm">Experience Level</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '5+ Years', value: '5' },
                { label: '10+ Years', value: '10' },
                { label: '15+ Years', value: '15' },
                { label: 'All', value: '' }
              ].map((exp) => (
                <Button
                  key={exp.value}
                  variant={filters.experience === exp.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter('experience', exp.value)}
                  className="justify-center text-xs"
                >
                  {exp.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 lg:w-64">
            <h4 className="font-medium text-sm">Price Range</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '£25-£35', value: '25-35' },
                { label: '£35-£45', value: '35-45' },
                { label: '£45+', value: '45-100' },
                { label: 'All', value: '' }
              ].map((price) => (
                <Button
                  key={price.value}
                  variant={filters.priceRange === price.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter('priceRange', price.value)}
                  className="justify-center text-xs"
                >
                  {price.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Car Fuel Type */}
          <div className="space-y-3 lg:w-64">
            <h4 className="font-medium text-sm">Car Fuel Type</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Petrol', value: 'petrol' },
                { label: 'Diesel', value: 'diesel' },
                { label: 'Hybrid', value: 'hybrid' },
                { label: 'Electric', value: 'electric' }
              ].map((fuel) => (
                <Button
                  key={fuel.value}
                  variant={filters.carFuelType === fuel.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter('carFuelType', fuel.value)}
                  className="justify-center text-xs"
                >
                  {fuel.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}