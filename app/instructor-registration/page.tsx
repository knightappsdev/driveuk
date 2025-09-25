'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight, User, MapPin, Car, Award, Phone, Mail, FileText, CheckCircle, Clock, Star } from 'lucide-react';

interface InstructorFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Location & Availability
  city: string;
  postcode: string;
  availability: string[];
  
  // Professional Information
  licenseNumber: string;
  yearsExperience: number;
  transmissionTypes: string[];
  specialties: string[];
  languages: string[];
  
  // Business Information
  hourlyRate: number;
  travelRadius: number;
  hasOwnVehicle: boolean;
  vehicleDetails: string;
  
  // Qualifications
  qualifications: string[];
  backgroundCheck: boolean;
  insuranceValid: boolean;
}

const initialFormData: InstructorFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  postcode: '',
  availability: [],
  licenseNumber: '',
  yearsExperience: 0,
  transmissionTypes: [],
  specialties: [],
  languages: ['English'],
  hourlyRate: 30,
  travelRadius: 10,
  hasOwnVehicle: false,
  vehicleDetails: '',
  qualifications: [],
  backgroundCheck: false,
  insuranceValid: false
};

const availabilityOptions = [
  'Monday Morning', 'Monday Afternoon', 'Monday Evening',
  'Tuesday Morning', 'Tuesday Afternoon', 'Tuesday Evening', 
  'Wednesday Morning', 'Wednesday Afternoon', 'Wednesday Evening',
  'Thursday Morning', 'Thursday Afternoon', 'Thursday Evening',
  'Friday Morning', 'Friday Afternoon', 'Friday Evening',
  'Saturday Morning', 'Saturday Afternoon', 'Saturday Evening',
  'Sunday Morning', 'Sunday Afternoon', 'Sunday Evening'
];

const specialtyOptions = [
  'Nervous Drivers', 'Intensive Courses', 'Test Preparation', 'Motorway Driving',
  'Advanced Skills', 'Pass Plus', 'Beginner Friendly', 'Young Drivers',
  'Older Learners', 'Refresher Courses', 'Theory Test Help', 'Anxiety Management',
  'Bilingual Instruction', 'Disability Support', 'Commercial Licenses', 'Eco Driving'
];

const languageOptions = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Polish', 'Portuguese',
  'Punjabi', 'Hindi', 'Urdu', 'Arabic', 'Mandarin', 'Welsh', 'BSL (British Sign Language)'
];

export default function InstructorRegistrationPage() {
  const [formData, setFormData] = useState<InstructorFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 5;

  const updateFormData = (field: keyof InstructorFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: keyof InstructorFormData, value: string) => {
    const currentArray = formData[field] as string[];
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, updatedArray);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Send form data to email API
      const response = await fetch('/api/email/send-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'instructor-registration',
          data: formData,
          customerEmail: formData.email,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Registration submitted successfully! We have sent you a confirmation email and will review your application within 48 hours.');
        // Reset form
        setFormData(initialFormData);
        setCurrentStep(1);
      } else {
        throw new Error(result.error || 'Failed to submit registration');
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('There was an error submitting your registration. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'
          }`}>
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < totalSteps && (
            <div className={`w-12 h-1 mx-2 ${
              step < currentStep ? 'bg-primary' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              placeholder="John"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              placeholder="Smith"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="john.smith@email.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              placeholder="+44 7123 456789"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
              placeholder="London"
              required
            />
          </div>
          <div>
            <Label htmlFor="postcode">Postcode *</Label>
            <Input
              id="postcode"
              value={formData.postcode}
              onChange={(e) => updateFormData('postcode', e.target.value)}
              placeholder="SW1A 1AA"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Professional Qualifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="licenseNumber">Driving License Number *</Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => updateFormData('licenseNumber', e.target.value)}
              placeholder="SMITH901234AB5CD"
              required
            />
          </div>
          <div>
            <Label htmlFor="yearsExperience">Years of Experience *</Label>
            <Input
              id="yearsExperience"
              type="number"
              min="0"
              max="50"
              value={formData.yearsExperience}
              onChange={(e) => updateFormData('yearsExperience', parseInt(e.target.value) || 0)}
              placeholder="5"
              required
            />
          </div>
        </div>

        <div>
          <Label>Transmission Types *</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {['Manual', 'Automatic'].map((type) => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.transmissionTypes.includes(type.toLowerCase())}
                  onChange={() => toggleArrayValue('transmissionTypes', type.toLowerCase())}
                  className="rounded"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label>Languages Spoken</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto">
            {languageOptions.map((language) => (
              <label key={language} className="flex items-center space-x-2 cursor-pointer p-2 border rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.languages.includes(language)}
                  onChange={() => toggleArrayValue('languages', language)}
                  className="rounded"
                />
                <span className="text-sm">{language}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="backgroundCheck"
              checked={formData.backgroundCheck}
              onChange={(e) => updateFormData('backgroundCheck', e.target.checked)}
              required
            />
            <Label htmlFor="backgroundCheck">I have a valid DBS (background) check *</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="insuranceValid"
              checked={formData.insuranceValid}
              onChange={(e) => updateFormData('insuranceValid', e.target.checked)}
              required
            />
            <Label htmlFor="insuranceValid">I have valid instructor insurance *</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Specialties & Expertise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Teaching Specialties (Select all that apply)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-64 overflow-y-auto">
            {specialtyOptions.map((specialty) => (
              <label key={specialty} className="flex items-center space-x-2 cursor-pointer p-2 border rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.specialties.includes(specialty)}
                  onChange={() => toggleArrayValue('specialties', specialty)}
                  className="rounded"
                />
                <span className="text-sm">{specialty}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hourlyRate">Hourly Rate (£) *</Label>
            <Input
              id="hourlyRate"
              type="number"
              min="20"
              max="100"
              value={formData.hourlyRate}
              onChange={(e) => updateFormData('hourlyRate', parseInt(e.target.value) || 30)}
              required
            />
            <p className="text-sm text-gray-500 mt-1">Recommended range: £25-£45 per hour</p>
          </div>
          <div>
            <Label htmlFor="travelRadius">Travel Radius (miles) *</Label>
            <Input
              id="travelRadius"
              type="number"
              min="1"
              max="50"
              value={formData.travelRadius}
              onChange={(e) => updateFormData('travelRadius', parseInt(e.target.value) || 10)}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="w-5 h-5" />
          Vehicle Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Do you have your own dual-control vehicle? *</Label>
          <RadioGroup 
            value={formData.hasOwnVehicle.toString()} 
            onValueChange={(value) => updateFormData('hasOwnVehicle', value === 'true')}
            className="mt-2"
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="true" id="own-vehicle-yes" />
              <Label htmlFor="own-vehicle-yes" className="flex-1 cursor-pointer">
                <div className="font-medium">Yes, I have my own vehicle</div>
                <div className="text-sm text-gray-500">Dual-control car with valid MOT and insurance</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="false" id="own-vehicle-no" />
              <Label htmlFor="own-vehicle-no" className="flex-1 cursor-pointer">
                <div className="font-medium">No, I need a vehicle provided</div>
                <div className="text-sm text-gray-500">I can use school vehicles (additional requirements may apply)</div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {formData.hasOwnVehicle && (
          <div>
            <Label htmlFor="vehicleDetails">Vehicle Details</Label>
            <textarea
              id="vehicleDetails"
              value={formData.vehicleDetails}
              onChange={(e) => updateFormData('vehicleDetails', e.target.value)}
              placeholder="Please provide details about your vehicle (make, model, year, any special features)..."
              className="w-full p-3 border rounded-lg h-24 resize-none"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderStep5 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>When are you available to teach? (Select all that apply)</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 max-h-64 overflow-y-auto">
            {availabilityOptions.map((slot) => (
              <label key={slot} className="flex items-center space-x-2 cursor-pointer p-2 border rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.availability.includes(slot)}
                  onChange={() => toggleArrayValue('availability', slot)}
                  className="rounded"
                />
                <span className="text-sm">{slot}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold mb-4">Application Summary</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Name:</strong> {formData.firstName} {formData.lastName}
            </div>
            <div>
              <strong>Location:</strong> {formData.city}, {formData.postcode}
            </div>
            <div>
              <strong>Experience:</strong> {formData.yearsExperience} years
            </div>
            <div>
              <strong>Rate:</strong> £{formData.hourlyRate}/hour
            </div>
            <div>
              <strong>Transmission:</strong> {formData.transmissionTypes.join(', ')}
            </div>
            <div>
              <strong>Languages:</strong> {formData.languages.slice(0, 3).join(', ')}
              {formData.languages.length > 3 && ` +${formData.languages.length - 3} more`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Join Our Team of Expert Instructors</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your expertise and help others learn to drive safely. Join the UK's most trusted driving school platform.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Schedule</h3>
              <p className="text-sm text-gray-600">Work when you want, set your own hours</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Steady Income</h3>
              <p className="text-sm text-gray-600">Regular bookings and competitive rates</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Professional Support</h3>
              <p className="text-sm text-gray-600">Marketing, admin, and business support</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Indicator */}
        {renderStepIndicator()}

        {/* Form Steps */}
        <div className="mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={
                (currentStep === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone)) ||
                (currentStep === 2 && (!formData.licenseNumber || formData.transmissionTypes.length === 0 || !formData.backgroundCheck || !formData.insuranceValid))
              }
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || formData.availability.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}