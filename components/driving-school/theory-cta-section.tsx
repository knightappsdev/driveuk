'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, BookOpen, Star, ArrowRight, Award, Target } from 'lucide-react';

interface CtaSettings {
  isActive: boolean;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  stat1Icon: string;
  stat1Text: string;
  stat1Count: number | null;
  stat2Icon: string;
  stat2Text: string;
  stat2Count: number | null;
  stat3Icon: string;
  stat3Text: string;
  stat3Count: number | null;
  footerText: string;
  backgroundGradientFrom: string;
  backgroundGradientVia: string;
  backgroundGradientTo: string;
  showDecorations: boolean;
  minHeight: string;
}

const iconMap = {
  CheckCircle,
  BookOpen,
  Star,
  ArrowRight,
  Award,
  Target
};

export default function TheoryCtaSection() {
  const [ctaSettings, setCtaSettings] = useState<CtaSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCtaSettings = async () => {
      try {
        const response = await fetch('/api/theory/cta');
        const data = await response.json();
        if (data.success && data.data) {
          setCtaSettings(data.data);
        }
      } catch (error) {
        console.error('Error fetching CTA settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCtaSettings();
  }, []);

  if (loading) {
    return (
      <section className="relative w-full min-h-96 bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 py-20 animate-pulse">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="h-12 bg-white/20 rounded-lg mb-6"></div>
            <div className="h-6 bg-white/20 rounded-lg mb-8 max-w-2xl mx-auto"></div>
            <div className="flex justify-center gap-6 mb-10">
              <div className="h-6 bg-white/20 rounded-lg w-32"></div>
              <div className="h-6 bg-white/20 rounded-lg w-32"></div>
              <div className="h-6 bg-white/20 rounded-lg w-32"></div>
            </div>
            <div className="h-12 bg-white/20 rounded-lg w-48 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!ctaSettings || !ctaSettings.isActive) {
    return null; // Don't render if disabled
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || CheckCircle;
    return IconComponent;
  };

  const Stat1Icon = getIcon(ctaSettings.stat1Icon);
  const Stat2Icon = getIcon(ctaSettings.stat2Icon);
  const Stat3Icon = getIcon(ctaSettings.stat3Icon);

  return (
    <section className={`relative w-full ${ctaSettings.minHeight} bg-gradient-to-r from-${ctaSettings.backgroundGradientFrom} via-${ctaSettings.backgroundGradientVia} to-${ctaSettings.backgroundGradientTo} py-20`}>
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {ctaSettings.title}
          </h2>
          <p className="text-xl lg:text-2xl text-white opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {ctaSettings.subtitle}
          </p>
          
          {/* Stats */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-10">
            <div className="flex items-center text-white opacity-90">
              <Stat1Icon className="w-6 h-6 mr-3 text-green-300" />
              <span className="text-lg font-medium">
                {ctaSettings.stat1Count ? `${ctaSettings.stat1Count} ` : ''}{ctaSettings.stat1Text}
              </span>
            </div>
            <div className="flex items-center text-white opacity-90">
              <Stat2Icon className="w-6 h-6 mr-3 text-green-300" />
              <span className="text-lg font-medium">
                {ctaSettings.stat2Count ? `${ctaSettings.stat2Count} ` : ''}{ctaSettings.stat2Text}
              </span>
            </div>
            <div className="flex items-center text-white opacity-90">
              <Stat3Icon className="w-6 h-6 mr-3 text-yellow-300" />
              <span className="text-lg font-medium">
                {ctaSettings.stat3Count ? `${ctaSettings.stat3Count} ` : ''}{ctaSettings.stat3Text}
              </span>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href={ctaSettings.buttonUrl}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
            >
              {ctaSettings.buttonText}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-white opacity-80 text-sm">
              {ctaSettings.footerText}
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      {ctaSettings.showDecorations && (
        <>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-300 opacity-20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-300 opacity-20 rounded-full blur-lg"></div>
        </>
      )}
    </section>
  );
}