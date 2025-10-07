import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Clock, PoundSterling, CheckCircle, Car, Settings, Users } from 'lucide-react';

// UK Practical Driving Skills as tested by DVSA
const ukPracticalSkills = [
  { id: 'mirrors', name: 'Mirror Usage', category: 'safety', description: 'Proper use of mirrors for observation' },
  { id: 'signals', name: 'Signalling', category: 'safety', description: 'Correct timing and positioning of signals' },
  { id: 'position', name: 'Road Position', category: 'control', description: 'Maintaining correct position on the road' },
  { id: 'speed', name: 'Speed Control', category: 'control', description: 'Appropriate speed for conditions' },
  { id: 'following', name: 'Following Distance', category: 'safety', description: 'Safe following distances' },
  { id: 'progress', name: 'Making Progress', category: 'control', description: 'Driving at appropriate speed and making progress' },
  { id: 'junctions', name: 'Junctions', category: 'manoeuvres', description: 'Approach, observation, and negotiation of junctions' },
  { id: 'roundabouts', name: 'Roundabouts', category: 'manoeuvres', description: 'Safe navigation of roundabouts' },
  { id: 'dual-carriageways', name: 'Dual Carriageways', category: 'manoeuvres', description: 'Joining and leaving dual carriageways' },
  { id: 'pedestrian-crossings', name: 'Pedestrian Crossings', category: 'safety', description: 'Approach and behaviour at crossings' },
  { id: 'vulnerable-users', name: 'Vulnerable Road Users', category: 'safety', description: 'Awareness of cyclists, pedestrians, motorcyclists' },
  { id: 'independent-driving', name: 'Independent Driving', category: 'navigation', description: 'Following directions or sat nav' },
  { id: 'parallel-parking', name: 'Parallel Parking', category: 'manoeuvres', description: 'Reversing into a parking space' },
  { id: 'bay-parking', name: 'Bay Parking', category: 'manoeuvres', description: 'Forward or reverse bay parking' },
  { id: 'pull-up-right', name: 'Pull Up on Right', category: 'manoeuvres', description: 'Pulling up on the right and reversing' },
  { id: 'emergency-stop', name: 'Emergency Stop', category: 'safety', description: 'Stopping quickly and safely in an emergency' },
  { id: 'hill-starts', name: 'Hill Starts', category: 'control', description: 'Starting on an uphill gradient' },
  { id: 'clutch-control', name: 'Clutch Control', category: 'control', description: 'Smooth operation of clutch (manual cars)' },
  { id: 'steering', name: 'Steering Control', category: 'control', description: 'Smooth and controlled steering' },
  { id: 'hazard-awareness', name: 'Hazard Awareness', category: 'safety', description: 'Identifying and responding to hazards' },
];

const skillCategories = {
  safety: { name: 'Safety & Awareness', color: 'bg-red-100 text-red-800', icon: '🛡️' },
  control: { name: 'Vehicle Control', color: 'bg-blue-100 text-blue-800', icon: '🎯' },
  manoeuvres: { name: 'Manoeuvres', color: 'bg-green-100 text-green-800', icon: '🚗' },
  navigation: { name: 'Navigation', color: 'bg-purple-100 text-purple-800', icon: '🧭' },
};

interface CustomCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookCustomCourse: (selectedSkills: string[], totalCost: number) => void;
}

export default function CustomCourseModal({ isOpen, onClose, onBookCustomCourse }: CustomCourseModalProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const skillCostPerHour = 30;

  if (!isOpen) return null;

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const totalCost = selectedSkills.length * skillCostPerHour;
  const estimatedHours = selectedSkills.length;

  const handleBookNow = () => {
    if (selectedSkills.length > 0) {
      onBookCustomCourse(selectedSkills, totalCost);
      onClose();
    }
  };

  const getSkillsByCategory = (category: string) => {
    return ukPracticalSkills.filter(skill => skill.category === category);
  };

  const handleSelectAll = (category: string) => {
    const categorySkills = getSkillsByCategory(category);
    const allSelected = categorySkills.every(skill => selectedSkills.includes(skill.id));
    
    if (allSelected) {
      // Deselect all skills in this category
      setSelectedSkills(prev => prev.filter(id => !categorySkills.some(skill => skill.id === id)));
    } else {
      // Select all skills in this category
      const newSkills = categorySkills.filter(skill => !selectedSkills.includes(skill.id));
      setSelectedSkills(prev => [...prev, ...newSkills.map(skill => skill.id)]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Custom Course Builder</h2>
              <p className="text-gray-600">Select the driving skills you consider in-demand</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-white/50"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-full">
          {/* Skills Selection */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[60vh] lg:max-h-none">
            <div className="space-y-6">
              {Object.entries(skillCategories).map(([categoryKey, category]) => (
                <div key={categoryKey} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <Badge className={`${category.color} text-xs`}>
                        {getSkillsByCategory(categoryKey).filter(skill => selectedSkills.includes(skill.id)).length}/
                        {getSkillsByCategory(categoryKey).length}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAll(categoryKey)}
                      className="text-xs"
                    >
                      {getSkillsByCategory(categoryKey).every(skill => selectedSkills.includes(skill.id)) 
                        ? 'Deselect All' 
                        : 'Select All'
                      }
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    {getSkillsByCategory(categoryKey).map((skill) => (
                      <div 
                        key={skill.id} 
                        className={`flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-gray-50 ${
                          selectedSkills.includes(skill.id) 
                            ? 'border-orange-300 bg-orange-50' 
                            : 'border-gray-200'
                        }`}
                        onClick={() => handleSkillToggle(skill.id)}
                      >
                        <Checkbox
                          id={skill.id}
                          checked={selectedSkills.includes(skill.id)}
                          onChange={() => handleSkillToggle(skill.id)}
                          className="mt-0.5 accent-orange-600"
                        />
                        <div className="flex-1 min-w-0">
                          <label 
                            htmlFor={skill.id} 
                            className="text-sm font-medium text-gray-900 cursor-pointer block"
                          >
                            {skill.name}
                          </label>
                          <p className="text-xs text-gray-600 mt-1">
                            {skill.description}
                          </p>
                          <p className="text-xs text-orange-600 font-medium mt-1">
                            £{skillCostPerHour}/hour
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:w-80 border-l bg-gray-50 p-6">
            <div className="space-y-4">
              {/* Cost Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Course Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Selected Skills:</span>
                    <span className="font-semibold">{selectedSkills.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estimated Hours:</span>
                    <span className="font-semibold">{estimatedHours}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total Cost:</span>
                    <span className="text-orange-600">£{totalCost}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Skills Preview */}
              {selectedSkills.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Selected Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedSkills.map(skillId => {
                        const skill = ukPracticalSkills.find(s => s.id === skillId);
                        const category = skillCategories[skill?.category as keyof typeof skillCategories];
                        return skill ? (
                          <div key={skillId} className="flex items-center gap-2">
                            <Badge className={`${category?.color} text-xs`}>
                              {category?.icon}
                            </Badge>
                            <span className="text-sm">{skill.name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Book Button */}
              <Button 
                onClick={handleBookNow}
                disabled={selectedSkills.length === 0}
                className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold py-6 text-lg"
              >
                {selectedSkills.length === 0 ? (
                  <>
                    <Settings className="w-5 h-5 mr-2" />
                    Select Skills to Continue
                  </>
                ) : (
                  <>
                    <Car className="w-5 h-5 mr-2" />
                    Book Custom Course - £{totalCost}
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                All skills are taught by DVSA certified instructors
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}