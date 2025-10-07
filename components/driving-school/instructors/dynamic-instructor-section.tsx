'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import InstructorCard from '@/components/driving-school/instructors/instructor-card';
import DynamicInstructorFilters from '@/components/driving-school/instructors/dynamic-instructor-filters';
import { ArrowRight, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Instructor } from '@/components/driving-school/instructors/instructor-card';

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

export default function DynamicInstructorSection() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [filters, setFilters] = useState<InstructorFilters>({
    postcode: '',
    transmission: '',
    ethnicity: '',
    religion: '',
    teachingExpertise: '',
    priceRange: '',
    experience: '',
    carFuelType: ''
  });

  // Fetch instructors from API
  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.postcode) params.append('postcode', filters.postcode);
      if (filters.transmission) params.append('transmission', filters.transmission);
      if (filters.ethnicity) params.append('ethnicity', filters.ethnicity);
      if (filters.religion) params.append('religion', filters.religion);
      if (filters.teachingExpertise) params.append('teachingExpertise', filters.teachingExpertise);
      if (filters.priceRange) params.append('priceRange', filters.priceRange);
      if (filters.experience) params.append('experience', filters.experience);
      if (filters.carFuelType) params.append('carFuelType', filters.carFuelType);
      params.append('limit', '20'); // Get more for carousel
      
      const response = await fetch(`/api/instructors?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setInstructors(data.instructors || []);
      } else {
        console.error('Error fetching instructors:', data.error);
        setInstructors([]);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setInstructors([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInstructors();
  }, [filters]);

  const handleFiltersChange = (newFilters: InstructorFilters) => {
    setFilters(newFilters);
    setCurrentCardIndex(0); // Reset carousel position when filters change
  };

  const handleInstructorContact = (instructor: Instructor, method: 'phone' | 'whatsapp') => {
    if (method === 'whatsapp') {
      const message = `Hi ${instructor.name}! I'm interested in driving lessons. Could you please provide me with more information about your availability and lesson packages?`;
      const phoneNumber = instructor.whatsappNumber || instructor.phone || '447756183484';
      const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
    } else {
      window.location.href = `tel:${instructor.phone}`;
    }
  };

  const handleViewProfile = (instructor: Instructor) => {
    const message = `Hi! I'd like to view the profile and get more information about instructor ${instructor.name}. Please provide me with detailed information about their availability and teaching style.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/447756183484?text=${encodedMessage}`, '_blank');
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (instructors.length > 4) {
      const interval = setInterval(() => {
        setCurrentCardIndex((prevIndex) => {
          const maxIndex = Math.max(0, instructors.length - 4);
          return prevIndex >= maxIndex ? 0 : prevIndex + 1;
        });
      }, 5000); // Auto-scroll every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [instructors.length]);

  const scrollTo = (direction: 'left' | 'right') => {
    const maxIndex = Math.max(0, instructors.length - 4);
    if (direction === 'left') {
      setCurrentCardIndex(prev => prev > 0 ? prev - 1 : maxIndex);
    } else {
      setCurrentCardIndex(prev => prev < maxIndex ? prev + 1 : 0);
    }
  };

  const visibleInstructors = instructors.slice(currentCardIndex, currentCardIndex + 4);

  return (
    <section id="instructors" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <h2 className="text-3xl lg:text-4xl font-bold">Find Your Perfect Instructor</h2>
            <div className="flex-1 flex justify-end">
              {/* Navigation Buttons - Moved outside cards */}
              {instructors.length > 4 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => scrollTo('left')}
                    className="bg-white hover:bg-gray-50 shadow-md border-gray-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => scrollTo('right')}
                    className="bg-white hover:bg-gray-50 shadow-md border-gray-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search by UK postcode to find experienced, qualified instructors in your area
          </p>
        </div>

        {/* Full-width filters above instructor cards */}
        <div className="mb-12">
          <DynamicInstructorFilters 
            onFiltersChange={handleFiltersChange}
            filters={filters}
            className="shadow-sm"
          />
        </div>

        {/* 4-card layout with auto-scroller */}
        <div className="relative">
          {loading ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : visibleInstructors.length > 0 ? (
            <>
              {/* Instructor Cards */}
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 transition-all duration-500">
                {visibleInstructors.map((instructor) => (
                  <InstructorCard
                    key={instructor.id}
                    instructor={instructor}
                    onViewProfile={handleViewProfile}
                    onContact={handleInstructorContact}
                  />
                ))}
              </div>

              {/* Pagination Dots */}
              {instructors.length > 4 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: Math.ceil(instructors.length / 4) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCardIndex(index * 4)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        Math.floor(currentCardIndex / 4) === index
                          ? 'bg-primary w-6'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* View All Button */}
              {Object.values(filters).some(v => v !== '') && instructors.length > 4 && (
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg">
                    View All {instructors.length} Matching Instructors
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No instructors found</h3>
              <p className="text-gray-600 mb-4">
                {Object.values(filters).some(v => v !== '') 
                  ? "Try adjusting your filters or search a different postcode area"
                  : "We're loading instructor profiles or contact us for availability"
                }
              </p>
              {Object.values(filters).some(v => v !== '') && (
                <Button 
                  variant="outline" 
                  onClick={() => handleFiltersChange({ 
                    postcode: '', 
                    transmission: '', 
                    ethnicity: '', 
                    religion: '', 
                    teachingExpertise: '', 
                    priceRange: '', 
                    experience: '', 
                    carFuelType: '' 
                  })}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="text-center mt-12 p-6 bg-primary/5 rounded-lg">
          <p className="text-sm text-gray-600">
            Can't find an instructor in your area? 
            <Button variant="link" className="p-0 ml-1 h-auto font-medium text-primary">
              Contact us at 07756 183484
            </Button>
            {" "}and we'll help you find the perfect match.
          </p>
        </div>
      </div>
    </section>
  );
}