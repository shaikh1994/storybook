import React, { useState, useEffect } from 'react';


import { 
  Play, 
  Rocket,
  Heart,
  CheckCircle,
  ArrowRight,
  Star,
  Mic,
  Video,
  BookOpen,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";

import { useNavigate } from 'react-router-dom';


const MarketingHomepage = () => {
  const navigate = useNavigate();
  const [showComingSoon, setShowComingSoon] = useState(false);
  
  const handleNavigation = (path) => {
    navigate(path);
  };

  const consistencyFeatures = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Same Character Throughout",
      description: "Your child's character looks identical in every single page"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Consistent World Building", 
      description: "The magical world stays visually coherent from start to finish"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Professional Quality",
      description: "Stories that look like real children's books, not random AI images"
    }
  ];

  const comingSoonFeatures = [
    {
      icon: <Mic className="w-8 h-8 text-blue-500" />,
      title: "Audio Narration",
      description: "Custom voice narration brings stories to life",
      timeline: "Q3 2025"
    },
    {
      icon: <Video className="w-8 h-8 text-red-500" />,
      title: "YouTube Videos", 
      description: "Transform stories into animated videos to share",
      timeline: "Q4 2025"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-green-500" />,
      title: "Amazon Publishing",
      description: "Turn your stories into real books on Amazon",
      timeline: "Q1 2026"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Mother of 2",
      text: "Finally! A story generator where my daughter Emma actually looks like Emma in every page. She's obsessed with her adventures!",
      rating: 5
    },
    {
      name: "Michael K.", 
      role: "Father",
      text: "The character consistency is incredible. Other apps made my son look different on every page - this actually tells a cohesive story.",
      rating: 5
    },
    {
      name: "Lisa R.",
      role: "Teacher",
      text: "I use this for my classroom. Kids love seeing the same character grow throughout the story. It's like having custom children's books!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Stories That Actually Look Like Stories
              </h1>
            </div>
            
            <div className="opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
              <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
                The first AI story generator with <span className="font-semibold text-purple-600">true character consistency</span>. 
                Your child's character looks identical in every single page, creating magical stories that feel real.
              </p>
            </div>

            <div className="opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => handleNavigation('/create')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
                >
                  <Play className="w-5 h-5" />
                  Try Free Demo
                </button>
                
                <button
                  onClick={() => handleNavigation('/pricing')}
                  className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                >
                  <Rocket className="w-5 h-5" />
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Character Consistency Demo */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Problem With Other AI Story Generators
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Most AI tools create disconnected images that confuse children. We solved this.
            </p>
          </div>

          {/* Before/After Comparison */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Other Tools */}
            <div className="opacity-0 animate-[slideInLeft_0.8s_ease-out_forwards] text-center">
              <h3 className="text-2xl font-bold text-red-600 mb-6">❌ Other AI Tools</h3>
              <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Character A</span>
                  </div>
                  <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Character B</span>
                  </div>
                  <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Character C</span>
                  </div>
                  <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Character D</span>
                  </div>
                </div>
                <p className="text-red-700 font-medium">Every page shows a different character. Kids get confused!</p>
              </div>
            </div>

            {/* Our Tool */}
            <div className="opacity-0 animate-[slideInRight_0.8s_ease-out_forwards] text-center">
              <h3 className="text-2xl font-bold text-green-600 mb-6">✅ Our AI Stories</h3>
              <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-purple-400 to-pink-400 h-32 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">Same Emma</span>
                  </div>
                  <div className="bg-gradient-to-br from-purple-400 to-pink-400 h-32 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">Same Emma</span>
                  </div>
                  <div className="bg-gradient-to-br from-purple-400 to-pink-400 h-32 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">Same Emma</span>
                  </div>
                  <div className="bg-gradient-to-br from-purple-400 to-pink-400 h-32 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">Same Emma</span>
                  </div>
                </div>
                <p className="text-green-700 font-medium">Perfect character consistency creates immersive stories!</p>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-8">
            {consistencyFeatures.map((feature, index) => (
              <div
                key={index}
                className={`opacity-0 animate-[fadeInUp_0.6s_ease-out_${0.2 * index}s_forwards] text-center p-8 bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300`}
              >
                <div className="text-purple-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Even More Magic Coming Soon
            </h2>
            <button
              onClick={() => setShowComingSoon(!showComingSoon)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Clock className="w-5 h-5" />
              See Future Updates
              {showComingSoon ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          <div
            className={`transition-all duration-500 overflow-hidden ${showComingSoon ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="grid md:grid-cols-3 gap-8 pt-8">
              {comingSoonFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white p-8 rounded-2xl shadow-lg text-center border-2 border-gray-100 transition-all duration-300 ${showComingSoon ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {feature.timeline}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-6">Join thousands of families already creating magical stories</p>
              <button
                onClick={() => handleNavigation('/pricing')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                <Rocket className="w-5 h-5" />
                Get Early Access
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Parents Love Our Stories
            </h2>
            <p className="text-xl text-gray-600">
              Real feedback from families using our AI story generator
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`opacity-0 animate-[fadeInUp_0.6s_ease-out_${0.2 * index}s_forwards] bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-lg border border-purple-100`}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="opacity-0 animate-[fadeInScale_0.8s_ease-out_forwards]">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Magic?
            </h2>
            <p className="text-xl text-purple-100 mb-10">
              Join thousands of families creating consistent, beautiful stories that kids actually love.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleNavigation('/create')}
                className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 justify-center"
              >
                <Play className="w-5 h-5" />
                Start Free Demo
              </button>
              
              <button
                onClick={() => handleNavigation('/pricing')}
                className="bg-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-purple-500 hover:bg-purple-800 hover:shadow-xl transition-all duration-300 flex items-center gap-3 justify-center"
              >
                <Sparkles className="w-5 h-5" />
                Choose Your Bundle
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Safe for Kids</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No Subscription Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Instant Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Professional Quality</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default MarketingHomepage;