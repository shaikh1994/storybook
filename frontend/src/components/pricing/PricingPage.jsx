import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Users, 
  Crown, 
  Infinity,
  Download,
  Palette,
  Zap,
  Shield,
  Heart
} from "lucide-react";

const PricingPage = () => {
    const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('family');
  
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handlePurchase = (planType, price) => {
    // In your real app, this would integrate with Stripe/PayPal/etc
    console.log(`Purchase ${planType} for ${price}`);
    alert(`This would process payment for ${planType} plan at ${price}`);
  };

  const bundles = [
    {
      id: 'starter',
      name: 'Starter Bundle',
      price: '$9.99',
      stories: '5 Stories',
      pages: 'Up to 5 pages each',
      description: 'Perfect for trying out our magic',
      features: [
        '5 AI-generated stories',
        'Character consistency',
        'Basic save functionality', 
        'PDF export',
        'All illustration styles'
      ],
      icon: <Heart className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'family',
      name: 'Family Bundle',
      price: '$24.99',
      stories: '15 Stories',
      pages: 'Up to 8 pages each',
      description: 'Most popular choice for families',
      popular: true,
      features: [
        '15 AI-generated stories',
        'Character consistency',
        'Save & organize collections',
        'PDF export',
        'All illustration styles',
        'Priority generation'
      ],
      icon: <Users className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300'
    },
    {
      id: 'creator',
      name: 'Creator Bundle', 
      price: '$49.99',
      stories: '35 Stories',
      pages: 'Up to 10 pages each',
      description: 'For educators & story enthusiasts',
      features: [
        '35 AI-generated stories',
        'Character consistency',
        'Advanced organization',
        'Bulk PDF export',
        'Premium illustration styles',
        'Priority generation',
        'Commercial use license'
      ],
      icon: <Crown className="w-8 h-8" />,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    }
  ];

  const subscription = {
    name: 'Premium Monthly',
    price: '$19.99',
    period: '/month',
    stories: 'Up to 50 stories',
    pages: 'Up to 8 pages each',
    description: 'For families who love creating stories',
    features: [
      'Up to 50 stories per month',
      'Character consistency',
      'All premium features',
      'Priority generation',
      'Early access to new features',
      'Cancel anytime'
    ],
    conditions: [
      'Fair use policy applies',
      'Stories limited to 8 pages maximum',
      'Designed for personal family use',
      'Commercial use requires enterprise plan'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => handleNavigation('/')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Choose Your Story Bundle
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple Pricing, Amazing Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect bundle for your family. All plans include our signature character consistency technology.
          </p>
        </div>


        {/* Bundle Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {bundles.map((bundle, index) => (
            <div
              key={bundle.id}
              className={`relative ${bundle.bgColor} p-8 rounded-3xl shadow-lg border-2 ${bundle.borderColor} hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105`}
              onClick={() => setSelectedPlan(bundle.id)}
            >
              {bundle.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${bundle.color} text-white mb-4`}>
                  {bundle.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{bundle.name}</h3>
                <p className="text-gray-600">{bundle.description}</p>
              </div>

              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-gray-900 mb-2">{bundle.price}</div>
                <div className="text-purple-600 font-semibold text-lg">{bundle.stories}</div>
                <div className="text-gray-500 text-sm">{bundle.pages}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {bundle.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(bundle.name, bundle.price)}
                className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  bundle.popular 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:scale-105' 
                    : 'bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg'
                }`}
              >
                Get {bundle.name}
              </button>
            </div>
          ))}
        </div>

        {/* Subscription Option */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-3xl shadow-2xl text-white">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                  <Infinity className="w-8 h-8" />
                  <h3 className="text-3xl font-bold">{subscription.name}</h3>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{subscription.price}</span>
                  <span className="text-xl text-indigo-200">{subscription.period}</span>
                </div>
                <p className="text-indigo-100 mb-4">{subscription.description}</p>
                <div className="text-indigo-200">
                  <div className="font-semibold">{subscription.stories}</div>
                  <div className="text-sm">{subscription.pages}</div>
                </div>
              </div>

              <div className="lg:w-1/2">
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    What's Included:
                  </h4>
                  <ul className="space-y-2">
                    {subscription.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-300" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm mb-6">
                  <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Fair Use Policy:
                  </h4>
                  <ul className="space-y-1">
                    {subscription.conditions.map((condition, i) => (
                      <li key={i} className="text-xs text-indigo-200">
                        • {condition}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePurchase(subscription.name, subscription.price)}
                  className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Infinity className="w-5 h-5" />
                  Start Monthly Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="text-center mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Why Choose Our Story Bundles?
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-2xl mb-4 inline-block">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">No Surprises</h4>
              <p className="text-sm text-gray-600">Pay once, create stories. No hidden fees or recurring charges.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-2xl mb-4 inline-block">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Access</h4>
              <p className="text-sm text-gray-600">Stories generate in under 2 minutes. No waiting, just magic.</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 p-4 rounded-2xl mb-4 inline-block">
                <Palette className="w-8 h-8 text-pink-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Premium Quality</h4>
              <p className="text-sm text-gray-600">Professional illustrations that look like real children's books.</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 p-4 rounded-2xl mb-4 inline-block">
                <Download className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Yours Forever</h4>
              <p className="text-sm text-gray-600">Download, print, share. Your stories belong to you.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3">Do I need to provide my own API key?</h4>
              <p className="text-gray-600">No! All our bundles include API costs. You can optionally provide your own OpenAI key for even faster generation, but it's not required.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3">What makes your character consistency different?</h4>
              <p className="text-gray-600">We use advanced AI techniques to ensure your character looks identical across all pages, unlike other tools that generate random different characters for each image.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3">Can I use these stories commercially?</h4>
              <p className="text-gray-600">Starter and Family bundles are for personal use. Creator bundle includes commercial licensing for teachers, content creators, and small businesses.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3">What if I run out of stories?</h4>
              <p className="text-gray-600">You can always purchase additional story packs for $4.99 (5 more stories) or upgrade to a larger bundle anytime.</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">Ready to create magical, consistent stories?</p>
          <button
            onClick={() => handleNavigation('/create')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            Try Free Demo First
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;