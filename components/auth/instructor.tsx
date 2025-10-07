'use client';

import { useState } from 'react';
import { Car, Calendar, Award, TrendingUp } from 'lucide-react';

export default function InstructorRegistrationCard() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    postcode: '',
    city: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    vehicleDetails: '',
    availability: [] as string[],
    qualifications: '',
    yearsExperience: '',
    hourlyRate: '',
    bio: '',
    adiGrade: 'trainee',
    drivingLicenseNumber: '',
    insuranceDetails: '',
    criminalRecordCheck: '',
    teachingExpertise: '',
    adiNumber: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const submitData = {
        ...formData,
        role: 'instructor',
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship,
        },
        yearsExperience: formData.yearsExperience ? Number(formData.yearsExperience) : undefined,
        hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
      };

      // Remove the separate emergency contact fields
      delete (submitData as any).emergencyContactName;
      delete (submitData as any).emergencyContactPhone;
      delete (submitData as any).emergencyContactRelationship;

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Registration successful! Redirecting to instructor dashboard...');
        // Redirect to instructor dashboard
        window.location.href = '/instructor';
      } else {
        alert(`Registration failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    if (checked) {
      setFormData({...formData, availability: [...formData.availability, day]});
    } else {
      setFormData({...formData, availability: formData.availability.filter(d => d !== day)});
    }
  };

  const benefits = [
    { icon: TrendingUp, text: "Grow your student base and income" },
    { icon: Calendar, text: "Flexible scheduling management" },
    { icon: Car, text: "Showcase your vehicle and expertise" },
    { icon: Award, text: "Professional profile and reviews" }
  ];

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="w-full px-4">
      <div className="w-full max-w-none mx-auto bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300" style={{ width: '60%' }}>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
          Register as an Instructor
        </h2>
        <p className="text-gray-600 text-lg">
          Share your expertise and build your driving school business
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">What you'll get:</h3>
        <div className="grid grid-cols-1 gap-3">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="flex items-center space-x-3">
                <IconComponent className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{benefit.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input 
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input 
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
          <input 
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., +44 7XXX XXXXXX"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input 
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input 
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Details</label>
          <select 
            value={formData.vehicleDetails}
            onChange={(e) => setFormData({...formData, vehicleDetails: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Select vehicle type</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Availability (Days)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {daysOfWeek.map(day => (
              <label key={day} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                <input 
                  type="checkbox" 
                  checked={formData.availability.includes(day)}
                  onChange={(e) => handleAvailabilityChange(day, e.target.checked)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
            <input 
              type="number"
              min="0"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (£)</label>
            <input 
              type="number"
              min="0"
              step="0.01"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teaching Expertise</label>
          <select 
            value={formData.teachingExpertise}
            onChange={(e) => setFormData({...formData, teachingExpertise: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Select teaching expertise</option>
            <option value="Auto Transmission">Auto Transmission</option>
            <option value="Manual Transmission">Manual Transmission</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ADI Number</label>
          <input 
            type="text"
            value={formData.adiNumber}
            onChange={(e) => setFormData({...formData, adiNumber: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter your ADI registration number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
          <textarea 
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            rows={4}
            placeholder="Tell us about your teaching experience and approach..."
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg text-lg font-semibold hover:from-green-700 hover:to-blue-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-300"
        >
          {isLoading ? 'Creating Account...' : 'Register as Instructor'}
        </button>
      </form>
      </div>
    </div>
  );
}