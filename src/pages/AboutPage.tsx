import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
  MapPin,
  ArrowLeft,
  Users,
  Target,
  Lightbulb,
  Award,
  Heart,
  Globe,
  Shield,
  Zap,
  BookOpen,
  TrendingUp,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AboutPage = () => {
  const stats = [
    { label: "Career Paths", value: "500+", icon: Target },
    { label: "Industries", value: "15", icon: Globe },
    { label: "Skills Tracked", value: "1000+", icon: BookOpen },
    { label: "Users Helped", value: "10K+", icon: Users },
  ];

  const features = [
    {
      icon: Target,
      title: "Interactive Career Roadmaps",
      description: "Visualize your career progression from entry-level to expert positions with detailed skill requirements and milestones.",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      icon: TrendingUp,
      title: "Career Branching",
      description: "Explore how to pivot between careers by leveraging transferable skills and experience.",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      icon: BookOpen,
      title: "Skill Assessment",
      description: "Evaluate your current skills and receive personalized career suggestions and development recommendations.",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track your career progress, skill development, and market trends with detailed analytics.",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "Former tech executive with 15+ years in career development and HR innovation.",
      avatar: "👩‍💼",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Full-stack developer passionate about creating intuitive career development tools.",
      avatar: "👨‍💻",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      bio: "UX designer focused on making career planning accessible and engaging for everyone.",
      avatar: "👩‍🎨",
    },
    {
      name: "David Kim",
      role: "Lead Data Scientist",
      bio: "Expert in career analytics and machine learning for personalized recommendations.",
      avatar: "👨‍🔬",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Empowerment",
      description: "We believe everyone deserves the tools and knowledge to build their dream career.",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Your career data is secure and private. We're committed to protecting your information.",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We continuously evolve our platform with cutting-edge technology and insights.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a supportive community of professionals helping each other grow.",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/home" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Career Atlas</h1>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="font-medium">
              Dashboard
            </Link>
            <Link to="/categories" className="font-medium">
              Categories
            </Link>
            <Link to="/my-paths" className="font-medium">
              My Paths
            </Link>
            <Link to="/explore" className="font-medium">
              Explore
            </Link>
            <Link to="/skills" className="font-medium">
              Skills
            </Link>
            <Link to="/branching" className="font-medium">
              Career Branching
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search careers..." className="pl-8" />
            </div>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About Career Atlas
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We're on a mission to democratize career development by providing everyone with the tools, 
              insights, and guidance they need to build fulfilling and successful careers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/categories">
                <Button size="lg" className="gap-2">
                  <Target className="h-5 w-5" />
                  Explore Careers
                </Button>
              </Link>
              <Link to="/skills">
                <Button size="lg" variant="outline" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  Take Skill Assessment
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Career Atlas was born from a simple belief: everyone deserves access to clear, 
                actionable career guidance. In today's rapidly evolving job market, traditional 
                career advice often falls short. We're changing that by combining cutting-edge 
                technology with deep industry insights to create personalized career roadmaps 
                that actually work.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're just starting your career, looking to switch industries, or 
                aiming for that next promotion, we provide the tools and insights you need 
                to make informed decisions and take confident steps toward your goals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and features designed to support every aspect of your career development journey.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                          <IconComponent className={`h-6 w-6 ${feature.color}`} />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do and every decision we make.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center">
                    <CardContent className="pt-6">
                      <div className={`p-3 rounded-lg ${value.bgColor} inline-block mb-4`}>
                        <IconComponent className={`h-8 w-8 ${value.color}`} />
                      </div>
                      <h3 className="font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind Career Atlas, dedicated to revolutionizing career development.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">{member.avatar}</div>
                    <h3 className="font-semibold mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Career Journey?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals who are already using Career Atlas to plan, 
              track, and achieve their career goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/categories">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Target className="h-5 w-5" />
                  Explore Careers
                </Button>
              </Link>
              <Link to="/skills">
                <Button size="lg" variant="outline" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  Take Assessment
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Career Atlas
              </h3>
              <p className="text-sm text-muted-foreground">
                Navigate your professional journey with interactive career
                roadmaps and skill-based discovery.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Features</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/categories"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Career Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/skills"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Skill Assessment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-paths"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    My Career Paths
                  </Link>
                </li>
                <li>
                  <Link
                    to="/branching"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Career Branching
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/blog"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Career Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guides"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Career Guides
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Career Atlas. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
