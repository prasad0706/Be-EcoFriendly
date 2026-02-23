import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
  {
    id: 1,
    title: "How to Switch to a Plastic-Free Kitchen",
    excerpt: "Small changes can lead to a big impact. Discover simple swaps to make your kitchen more eco-friendly.",
    category: "Sustainability",
    author: "Elena Green",
    date: "Oct 12, 2025",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "The Ultimate Guide to Composting for Beginners",
    excerpt: "Everything you need to know about starting your first compost bin at home, no matter your space.",
    category: "Zero Waste",
    author: "Marcus Thorne",
    date: "Oct 08, 2025",
    image: "https://images.unsplash.com/photo-1591717399432-c10a307076f7?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "10 Sustainable Gift Ideas for the Holidays",
    excerpt: "Celebrate the season of giving with gifts that give back to the planet. Our top eco-friendly picks.",
    category: "Gifting",
    author: "Sarah Bloom",
    date: "Oct 05, 2025",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Understanding Carbon Offsets: Do They Really Work?",
    excerpt: "A deep dive into the world of carbon credits and how individuals can make a real difference in reducing their footprint.",
    category: "Environment",
    author: "Dr. David Thorne",
    date: "Sep 28, 2025",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Sustainable Fashion: Fast Fashion vs. Quality",
    excerpt: "Why buying less and choosing better is the ultimate style statement for the modern eco-conscious consumer.",
    category: "Fashion",
    author: "Mia Rossi",
    date: "Sep 20, 2025",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop"
  }
];

const Blogs = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-soft-green text-primary rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-4 md:mb-6 border border-primary/10"
          >
            Our Journal
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4 md:mb-6 tracking-tight leading-tight"
          >
            Stories of <span className="gradient-text">Sustainability</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed"
          >
            Insights, guides, and stories to help you live a more eco-conscious lifestyle and join the movement.
          </motion.p>
        </div>

        {/* Featured Search */}
        <div className="max-w-xl mx-auto mb-10 md:mb-16 relative px-4 md:px-0">
          <Search className="absolute left-10 md:left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles, tips..."
            className="w-full pl-14 md:pl-16 pr-6 md:pr-8 py-4 md:py-5 bg-white rounded-2xl md:rounded-3xl border-none shadow-premium focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-700 text-sm md:text-base"
          />
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-4 md:px-0">
          {BLOG_POSTS.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-premium group hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
            >
              <div className="relative h-56 md:h-64 overflow-hidden shrink-0">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 md:top-6 left-4 md:left-6">
                  <span className="px-3 md:px-4 py-1.5 md:py-2 bg-white/95 backdrop-blur-md rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <User className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                    {post.author}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 md:mb-4 group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 font-medium line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-auto">
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-primary font-black uppercase tracking-widest text-[10px] md:text-xs group/link"
                  >
                    Read Article
                    <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4 ml-2 group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
