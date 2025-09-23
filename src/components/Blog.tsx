import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      title: "Understanding Motor Insurance in Tanzania: A Complete Guide",
      excerpt: "Everything you need to know about motor insurance requirements, coverage options, and how to choose the right policy for your vehicle in Tanzania.",
      author: "LF Insurance Team",
      date: "September 20, 2025",
      readTime: "5 min read",
      category: "Auto Insurance",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop"
    },
    {
      title: "Top 5 Benefits of Group Health Insurance for Businesses",
      excerpt: "Discover how group health insurance can benefit your business, improve employee satisfaction, and provide cost-effective healthcare coverage for your team.",
      author: "Dr. Amina Rashid",
      date: "September 18, 2025", 
      readTime: "7 min read",
      category: "Health Insurance",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop"
    },
    {
      title: "Property Insurance: Protecting Your Home Investment",
      excerpt: "Learn about different types of property insurance, what's covered, and how to ensure your home and belongings are adequately protected against risks.",
      author: "John Mwenda",
      date: "September 15, 2025",
      readTime: "6 min read", 
      category: "Property Insurance",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop"
    },
    {
      title: "Travel Insurance: Essential Protection for Your Journeys",
      excerpt: "Why travel insurance is crucial for both domestic and international travel, and what coverage options are available to protect your trips.",
      author: "Sarah Kimani",
      date: "September 12, 2025",
      readTime: "4 min read",
      category: "Travel Insurance", 
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop"
    }
  ];

  const categories = [
    "All Posts",
    "Auto Insurance", 
    "Health Insurance",
    "Property Insurance",
    "Business Insurance",
    "Travel Insurance",
    "Life Insurance"
  ];

  return (
    <section id="blog" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <Badge variant="secondary" className="text-primary font-semibold px-4 py-2 mb-4">
            Insurance Insights Blog
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Latest News & Insights
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest insurance news, tips, and expert insights to help you 
            make informed decisions about your insurance coverage.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-up">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={index === 0 ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <Card 
              key={index}
              className="group hover:shadow-large transition-all duration-300 animate-fade-up border-0 shadow-medium overflow-hidden"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {post.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto font-semibold text-primary hover:text-primary-dark group"
                >
                  Read More 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="text-center animate-fade-up">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 shadow-medium max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-muted-foreground mb-6">
              Get the latest insurance news, tips, and exclusive offers delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="gradient-primary text-white font-semibold px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;