import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2, Heart, MessageCircle, Clock, Leaf } from 'lucide-react';
import Button from '../components/common/Button';

const BLOG_POSTS = [
  {
    id: 1,
    title: "How to Switch to a Plastic-Free Kitchen",
    content: `
      <h2>The Plastic Problem</h2>
      <p>Single-use plastics are one of the biggest contributors to environmental pollution. Our kitchens are often the hub of plastic waste, from produce bags to dish soap bottles. Making the switch might seem daunting, but it's about progress, not perfection.</p>
      
      <h3>1. Audit Your Kitchen</h3>
      <p>Start by identifying the most common plastic items you use. Is it cling wrap? Plastic sponges? Take-out containers? Once you know what you have, you can find sustainable alternatives.</p>
      
      <h3>2. Sustainable Swaps</h3>
      <ul>
        <li><strong>Beeswax Wraps:</strong> A perfect alternative to plastic cling wrap. They are reusable, compostable, and keep food fresh.</li>
        <li><strong>Silicon Bags:</strong> Replace zip-lock bags with high-quality silicone bags that can be washed and reused thousands of times.</li>
        <li><strong>Glass Containers:</strong> Stop using plastic Tupperware and switch to glass. It's safer for your food and better for the planet.</li>
      </ul>
      
      <p>By making these small changes, you're not just reducing waste; you're sending a message to manufacturers that demand for sustainable products is growing.</p>
    `,
    category: "Sustainability",
    author: "Elena Green",
    date: "Oct 12, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "The Ultimate Guide to Composting for Beginners",
    content: `
      <h2>Why Compost?</h2>
      <p>Composting is the process of recycling organic waste into nutrient-rich soil. It reduces methane emissions from landfills and provides a free, natural fertilizer for your garden.</p>
      
      <h3>The Golden Rule: Browns and Greens</h3>
      <p>A successful compost pile needs a balance of "Green" materials (nitrogen-rich) and "Brown" materials (carbon-rich).</p>
      <ul>
        <li><strong>Greens:</strong> Fruit and veggie scraps, coffee grounds, fresh grass clippings.</li>
        <li><strong>Browns:</strong> Dried leaves, cardboard, paper, straw.</li>
      </ul>
      
      <h3>How to Start</h3>
      <ol>
        <li>Choose a spot: Use a bin or just a pile in a corner of your yard.</li>
        <li>Layer it: Start with a layer of browns, then a layer of greens.</li>
        <li>Keep it moist: Your compost should feel like a wrung-out sponge.</li>
        <li>Turn it: Mix it every few weeks to provide oxygen to the microbes.</li>
      </ol>
    `,
    category: "Zero Waste",
    author: "Marcus Thorne",
    date: "Oct 08, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1591717399432-c10a307076f7?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "10 Sustainable Gift Ideas for the Holidays",
    content: `
      <h2>Celebrate Consciously</h2>
      <p>The holiday season often leads to an explosion of waste. From non-recyclable wrapping paper to gifts that end up in the bin, the environmental impact is huge. Here are 10 ideas for gifts that give back to the planet.</p>
      
      <ul>
        <li><strong>Reusable Coffee Cups:</strong> A classic for a reason. Choose a high-quality glass or steel one.</li>
        <li><strong>Eco-Friendly Skincare:</strong> Look for brands with plastic-free packaging and natural ingredients.</li>
        <li><strong>Experiences:</strong> Instead of a physical object, gift a cooking class, a concert ticket, or a massage.</li>
        <li><strong>Donations:</strong> Make a donation to an environmental charity in their name.</li>
        <li><strong>Plants:</strong> A gift that literally grows and cleans the air!</li>
      </ul>
    `,
    category: "Gifting",
    author: "Sarah Bloom",
    date: "Oct 05, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Understanding Carbon Offsets: Do They Really Work?",
    content: `
      <h2>Beyond the Carbon Credit</h2>
      <p>Carbon offsetting has become a popular way for companies and individuals to tackle their environmental impact. But what exactly are they, and do they actually make a difference?</p>
      
      <h3>What is a Carbon Offset?</h3>
      <p>An offset is a reduction in emissions of carbon dioxide or other greenhouse gases made in order to compensate for emissions made elsewhere.</p>
      
      <h3>The Reality Check</h3>
      <p>While offsets can fund vital projects like reforestation or renewable energy development, they should never be a "license to pollute." The first priority must always be reducing our own direct emissions.</p>
      
      <h3>How to Choose Quality Offsets</h3>
      <p>Look for gold-standard certifications that ensure the project is permanent, additional (wouldn't have happened without the funding), and verified by third parties.</p>
    `,
    category: "Environment",
    author: "Dr. David Thorne",
    date: "Sep 28, 2025",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Sustainable Fashion: Fast Fashion vs. Quality",
    content: `
      <h2>The True Cost of a $5 T-Shirt</h2>
      <p>Fashion is one of the most polluting industries in the world. The rise of fast fashion has led to a cycle of overconsumption and waste that the planet simply cannot sustain.</p>
      
      <h3>1. Quality Over Quantity</h3>
      <p>Investing in well-made pieces from sustainable materials might cost more upfront, but they last much longer and ultimately reduce your environmental footprint.</p>
      
      <h3>2. Material Matters</h3>
      <p>Look for organic cotton, linen, hemp, or recycled fibers. Avoid virgin polyester, which is essentially made from plastic and sheds microplastics in every wash.</p>
      
      <h3>3. Ethical Production</h3>
      <p>Support brands that are transparent about their supply chain and ensure fair wages and safe working conditions for their garment workers.</p>
    `,
    category: "Fashion",
    author: "Mia Rossi",
    date: "Sep 20, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop"
  }
];

const BlogDetail = () => {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-4">Post Not Found</h2>
          <Link to="/blogs">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gray-900">
          <img 
            src={post.image} 
            className="w-full h-full object-cover opacity-60"
            alt={post.title}
          />
        </div>
        <div className="max-w-4xl mx-auto px-8 relative z-10 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white mb-8 border border-white/20"
          >
            <Leaf className="h-4 w-4" />
            <span className="text-xs font-black uppercase tracking-widest">{post.category}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-10 leading-tight"
          >
            {post.title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-8 text-white/80 font-bold"
          >
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{post.readTime}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/blogs" className="inline-flex items-center text-primary font-black uppercase text-xs tracking-widest mb-12 hover:gap-3 transition-all">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Journal
          </Link>
          
          <div 
            className="prose prose-lg prose-primary max-w-none 
              prose-headings:font-black prose-headings:tracking-tight 
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:font-medium
              prose-li:text-gray-600 prose-li:font-medium
              prose-strong:text-gray-900 prose-strong:font-black"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Social Interactions */}
          <div className="mt-20 pt-10 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors font-bold">
                <Heart className="h-6 w-6" /> <span>2.4k</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-bold">
                <MessageCircle className="h-6 w-6" /> <span>48 Comments</span>
              </button>
            </div>
            <button className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors font-bold">
              <Share2 className="h-6 w-6" /> <span>Share</span>
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter / Related */}
      <section className="py-24 bg-gray-50 px-8">
        <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center text-white">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Join our sustainable<br /> newsletter community.</h2>
            <p className="text-xl text-white/60 font-medium mb-12 max-w-xl mx-auto">Get weekly guides, eco-tips, and exclusive offers delivered straight to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input type="email" placeholder="Email address" className="h-16 px-8 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all font-bold text-lg min-w-[300px]" />
              <Button variant="white" className="h-16 px-10 rounded-2xl text-primary font-black">Subscribe Now</Button>
            </div>
          </div>
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Leaf className="w-64 h-64" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
