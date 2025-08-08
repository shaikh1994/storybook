// src/components/marketing-homepage/MarketingHomepage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Sparkles,
  Zap,
  Users,
  Award,
  TrendingUp,
  Palette,
  Shield
} from "lucide-react";
import './MarketingHomepage.css';

const MarketingHomepage = () => {
  const navigate = useNavigate();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const consistencyFeatures = [
    {
      icon: <Heart className="w-10 h-10" />,
      title: "Same Character Throughout",
      description: "Your child's character looks identical in every single page, creating magical stories that feel real.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: <Rocket className="w-10 h-10" />,
      title: "Consistent World Building", 
      description: "The magical world stays visually coherent from start to finish, maintaining immersion.",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Professional Quality",
      description: "Stories that look like real children's books, not random AI images stitched together.",
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  const advancedFeatures = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Smart Art Direction",
      description: "AI maintains consistent art style and lighting across all pages",
      color: "text-purple-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Character Memory",
      description: "Advanced AI remembers every detail about your child's appearance",
      color: "text-blue-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Child-Safe Content",
      description: "All stories are automatically screened for age-appropriate content",
      color: "text-green-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Learning Focus",
      description: "Stories can be tailored to educational themes and moral lessons",
      color: "text-orange-600"
    }
  ];

  const comingSoonFeatures = [
    {
      icon: <Mic className="w-10 h-10 text-blue-500" />,
      title: "Audio Narration",
      description: "Custom voice narration brings stories to life with professional quality",
      timeline: "Q3 2025",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: <Video className="w-10 h-10 text-red-500" />,
      title: "YouTube Videos", 
      description: "Transform stories into animated videos to share with family and friends",
      timeline: "Q4 2025",
      bgColor: "from-red-50 to-pink-50"
    },
    {
      icon: <BookOpen className="w-10 h-10 text-green-500" />,
      title: "Amazon Publishing",
      description: "Turn your stories into real printed books available on Amazon",
      timeline: "Q1 2026",
      bgColor: "from-green-50 to-emerald-50"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Mother of 2",
      text: "Finally! A story generator where my daughter Emma actually looks like Emma in every page. She's obsessed with her adventures!",
      rating: 5,
      avatar: "👩‍🦰"
    },
    {
      name: "Michael K.", 
      role: "Father",
      text: "The character consistency is incredible. Other apps made my son look different on every page - this actually tells a cohesive story.",
      rating: 5,
      avatar: "👨‍🦲"
    },
    {
      name: "Lisa R.",
      role: "Teacher",
      text: "I use this for my classroom. Kids love seeing the same character grow throughout the story. It's like having custom children's books!",
      rating: 5,
      avatar: "👩‍🏫"
    }
  ];

  const stats = [
    { number: "50K+", label: "Stories Created", icon: <BookOpen className="w-6 h-6" /> },
    { number: "15K+", label: "Happy Families", icon: <Heart className="w-6 h-6" /> },
    { number: "4.9/5", label: "Parent Rating", icon: <Star className="w-6 h-6" /> },
    { number: "98%", label: "Character Accuracy", icon: <Zap className="w-6 h-6" /> }
  ];

  return (
    <div className="marketing-homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <Sparkles className="w-4 h-4" />
              <span>Revolutionary Character Consistency Technology</span>
            </div>
            
            <h1 className="hero-title">
              Create Magical
              <span className="hero-title-gradient"> Personalized </span>
              Stories for Your Child
            </h1>
            
            <p className="hero-description">
              The first AI story generator that keeps your child's character looking exactly the same throughout the entire story. 
              Your child's character looks identical in every single page, creating magical stories that feel real.
            </p>

            <div className="hero-actions">
              <button
                onClick={() => handleNavigation('/create')}
                className="btn-primary"
              >
                <Play className="w-5 h-5" />
                Try Free Demo
              </button>
              
              <button
                onClick={() => handleNavigation('/pricing')}
                className="btn-secondary"
              >
                <Rocket className="w-5 h-5" />
                View Pricing
              </button>
            </div>

            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Character Consistency Demo */}
      <section className="demo-section" data-animate id="demo">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              The Problem With Other AI Story Generators
            </h2>
            <p className="section-description">
              Most AI tools create disconnected images that confuse children. We solved this.
            </p>
          </div>

          <div className="demo-comparison">
            {/* Bad Example */}
            <div className="comparison-card comparison-bad">
              <div className="comparison-header">
                <h3 className="comparison-title bad">Other AI Tools</h3>
                <span className="comparison-badge bad">❌ Inconsistent</span>
              </div>
              <div className="character-grid">
                <div className="character-item">
                  <div className="character-placeholder bad-1"></div>
                  <span>Page 1: Different hair</span>
                </div>
                <div className="character-item">
                  <div className="character-placeholder bad-2"></div>
                  <span>Page 2: Different face</span>
                </div>
                <div className="character-item">
                  <div className="character-placeholder bad-3"></div>
                  <span>Page 3: Different style</span>
                </div>
              </div>
              <p className="comparison-feedback bad">Kids get confused and lose interest!</p>
            </div>

            {/* Good Example */}
            <div className="comparison-card comparison-good">
              <div className="comparison-header">
                <h3 className="comparison-title good">StoryBook Creator</h3>
                <span className="comparison-badge good">✅ Perfect Consistency</span>
              </div>
              <div className="character-grid">
                <div className="character-item">
                  <div className="character-placeholder good"></div>
                  <span>Page 1: Same Emma</span>
                </div>
                <div className="character-item">
                  <div className="character-placeholder good"></div>
                  <span>Page 2: Same Emma</span>
                </div>
                <div className="character-item">
                  <div className="character-placeholder good"></div>
                  <span>Page 3: Same Emma</span>
                </div>
              </div>
              <p className="comparison-feedback good">Perfect character consistency creates immersive stories!</p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="features-grid">
            {consistencyFeatures.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${isVisible.demo ? 'animate-in' : ''}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`feature-icon bg-gradient-to-r ${feature.gradient}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="advanced-features-section" data-animate id="advanced">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              Powered by Advanced AI Technology
            </h2>
            <p className="section-description">
              Our proprietary algorithms ensure every story is a masterpiece
            </p>
          </div>

          <div className="advanced-features-grid">
            {advancedFeatures.map((feature, index) => (
              <div
                key={index}
                className={`advanced-feature-card ${isVisible.advanced ? 'animate-in' : ''}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`advanced-feature-icon ${feature.color}`}>
                  {feature.icon}
                </div>
                <div className="advanced-feature-content">
                  <h3 className="advanced-feature-title">{feature.title}</h3>
                  <p className="advanced-feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="coming-soon-section" data-animate id="coming-soon">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Even More Magic Coming Soon</h2>
            <button
              onClick={() => setShowComingSoon(!showComingSoon)}
              className="coming-soon-toggle"
            >
              <Clock className="w-5 h-5" />
              See Future Updates
              {showComingSoon ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          <div className={`coming-soon-content ${showComingSoon ? 'expanded' : ''}`}>
            <div className="coming-soon-grid">
              {comingSoonFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`coming-soon-card bg-gradient-to-br ${feature.bgColor}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="coming-soon-icon">
                    {feature.icon}
                  </div>
                  <h3 className="coming-soon-title">{feature.title}</h3>
                  <p className="coming-soon-description">{feature.description}</p>
                  <span className="coming-soon-timeline">{feature.timeline}</span>
                </div>
              ))}
            </div>
            
            <div className="coming-soon-cta">
              <p className="coming-soon-cta-text">Join thousands of families already creating magical stories</p>
              <button
                onClick={() => handleNavigation('/pricing')}
                className="coming-soon-cta-button"
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
      <section className="testimonials-section" data-animate id="testimonials">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Parents Love Our Stories</h2>
            <p className="section-description">
              Real feedback from families using our AI story generator
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`testimonial-card ${isVisible.testimonials ? 'animate-in' : ''}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.role}</p>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section">
        <div className="final-cta-content">
          <div className="final-cta-text">
            <h2 className="final-cta-title">
              Ready to Create Magical Stories?
            </h2>
            <p className="final-cta-description">
              Join thousands of families creating consistent, beautiful stories that kids actually love.
            </p>
            
            <div className="final-cta-actions">
              <button
                onClick={() => handleNavigation('/create')}
                className="final-cta-primary"
              >
                <Play className="w-5 h-5" />
                Start Free Demo
              </button>
              
              <button
                onClick={() => handleNavigation('/pricing')}
                className="final-cta-secondary"
              >
                <Sparkles className="w-5 h-5" />
                Choose Your Bundle
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="trust-section">
        <div className="section-container">
          <div className="trust-indicators">
            <div className="trust-item">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Safe for Kids</span>
            </div>
            <div className="trust-item">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No Subscription Required</span>
            </div>
            <div className="trust-item">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Instant Generation</span>
            </div>
            <div className="trust-item">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Professional Quality</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketingHomepage;