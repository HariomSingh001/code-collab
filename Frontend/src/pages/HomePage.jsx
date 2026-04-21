import { Link } from "react-router";
import {
  Zap,
  Code2,
  Users,
  Trophy,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  Monitor,
  MessageSquare,
  Target,
  Rocket,
  Star,
  ChevronRight,
} from "lucide-react";

const Logo = ({ size = "md" }) => {
  const sizes = {
    sm: "size-10",
    md: "size-14",
    lg: "size-20",
  };
  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };
  return (
    <div className={`relative ${sizes[size]} rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent grid place-items-center shadow-2xl shadow-primary/30`}>
      <span className={`${textSizes[size]} font-black text-primary-content tracking-tighter`}>&lt;/&gt;</span>
      <Zap className="absolute -top-1 -right-1 size-4 text-warning fill-warning" />
    </div>
  );
};

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-base-100/60 border-b border-base-content/5">
    <div className="container mx-auto px-6 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <Logo size="sm" />
        <span className="font-black text-xl tracking-tight">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Code</span>st
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <Link to="/auth" className="btn btn-ghost btn-sm">Sign in</Link>
        <Link to="/auth?mode=signup" className="btn btn-primary btn-sm shadow-lg shadow-primary/25">
          Get Started <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
    {/* Animated background */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute top-20 left-10 size-72 rounded-full bg-primary/30 blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-10 size-96 rounded-full bg-secondary/20 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-accent/10 blur-[150px]" />
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
    </div>

    <div className="relative container mx-auto px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-bounce">
          <Sparkles className="size-4" />
          <span>The future of coding interviews</span>
          <ChevronRight className="size-4" />
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
          <span className="block">Code Together.</span>
          <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Grow Together.
          </span>
        </h1>

        <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Practice coding interviews with peers in real-time. Collaborate on problems, 
          get instant feedback, and land your dream job.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/auth?mode=signup" className="btn btn-primary btn-lg shadow-xl shadow-primary/30 gap-2 px-8">
            Start Practicing Free
            <Rocket className="size-5" />
          </Link>
          <button className="btn btn-ghost btn-lg gap-2">
            <Play className="size-5 fill-current" />
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { value: "10K+", label: "Active Users" },
            { value: "50K+", label: "Problems Solved" },
            { value: "95%", label: "Success Rate" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-base-content/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating code editor preview */}
      <div className="relative mt-20 max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-base-300 via-transparent to-transparent z-10 pointer-events-none" />
        <div className="rounded-2xl border border-base-content/10 bg-base-100 shadow-2xl overflow-hidden">
          {/* Editor header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-base-200 border-b border-base-content/10">
            <div className="flex gap-1.5">
              <div className="size-3 rounded-full bg-error" />
              <div className="size-3 rounded-full bg-warning" />
              <div className="size-3 rounded-full bg-success" />
            </div>
            <span className="text-xs text-base-content/50 ml-2">two-sum.js</span>
          </div>
          {/* Code preview */}
          <div className="p-6 font-mono text-sm">
            <pre className="text-base-content/80">
              <code>{`function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const features = [
  {
    icon: Monitor,
    title: "Real-time Collaboration",
    description: "Code together with peers in a shared editor. See changes instantly as you both work on solutions.",
    color: "text-primary",
  },
  {
    icon: MessageSquare,
    title: "Built-in Video Chat",
    description: "Communicate seamlessly with integrated video and voice chat. Just like a real interview.",
    color: "text-secondary",
  },
  {
    icon: Code2,
    title: "500+ Problems",
    description: "Practice with curated problems from easy to hard. Cover all major topics and patterns.",
    color: "text-accent",
  },
  {
    icon: Target,
    title: "Smart Matching",
    description: "Get paired with developers at your skill level. Learn and grow together effectively.",
    color: "text-warning",
  },
  {
    icon: Trophy,
    title: "Track Progress",
    description: "Monitor your improvement with detailed analytics. See your strengths and areas to improve.",
    color: "text-success",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join a supportive community of developers. Share tips, solutions, and encouragement.",
    color: "text-info",
  },
];

const FeaturesSection = () => (
  <section className="py-32 relative">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
          <Star className="size-4 fill-current" />
          Features
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          Everything you need to{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ace interviews</span>
        </h2>
        <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
          Built by engineers, for engineers. We know what it takes to succeed.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group relative p-8 rounded-2xl bg-base-100 border border-base-content/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
          >
            <div className={`size-12 rounded-xl bg-base-200 grid place-items-center mb-5 ${feature.color} group-hover:scale-110 transition-transform`}>
              <feature.icon className="size-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-base-content/60 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const steps = [
  { step: "01", title: "Create Account", description: "Sign up in seconds with email or social login" },
  { step: "02", title: "Choose a Problem", description: "Pick from 500+ curated coding challenges" },
  { step: "03", title: "Start Session", description: "Invite a peer or get matched automatically" },
  { step: "04", title: "Code & Learn", description: "Solve together, discuss, and improve" },
];

const HowItWorksSection = () => (
  <section className="py-32 bg-base-200/50 relative overflow-hidden">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute top-0 right-0 size-96 rounded-full bg-primary/10 blur-[100px]" />
    </div>

    <div className="relative container mx-auto px-6">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
          <Zap className="size-4" />
          How it works
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          Start in <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">minutes</span>
        </h2>
        <p className="text-lg text-base-content/60">Four simple steps to level up your interview skills</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((item, index) => (
          <div key={item.step} className="relative">
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
            )}
            <div className="text-6xl font-black text-primary/20 mb-4">{item.step}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-base-content/60">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const testimonials = [
  { name: "Sarah Chen", role: "Software Engineer @ Google", text: "Codest helped me land my dream job. The peer practice sessions were invaluable.", avatar: "S" },
  { name: "James Wilson", role: "Senior Dev @ Meta", text: "Best platform for interview prep. The real-time collaboration is a game changer.", avatar: "J" },
  { name: "Priya Sharma", role: "Backend Engineer @ Stripe", text: "I improved my problem-solving speed by 3x. Highly recommend to everyone!", avatar: "P" },
];

const TestimonialsSection = () => (
  <section className="py-32">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium mb-4">
          <Users className="size-4" />
          Testimonials
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          Loved by <span className="bg-gradient-to-r from-warning to-error bg-clip-text text-transparent">developers</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="p-8 rounded-2xl bg-base-100 border border-base-content/5">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 text-warning fill-warning" />
              ))}
            </div>
            <p className="text-base-content/80 mb-6 leading-relaxed">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-gradient-to-br from-primary to-secondary grid place-items-center text-sm font-bold text-primary-content">
                {t.avatar}
              </div>
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-base-content/60">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-32 relative overflow-hidden">
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20" />
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-primary/20 blur-[100px]" />
    </div>

    <div className="relative container mx-auto px-6 text-center">
      <Logo size="lg" />
      <h2 className="text-4xl md:text-6xl font-black mt-8 mb-6">
        Ready to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">level up?</span>
      </h2>
      <p className="text-xl text-base-content/70 max-w-xl mx-auto mb-10">
        Join thousands of developers who are acing their interviews with Codest.
      </p>
      <Link to="/auth?mode=signup" className="btn btn-primary btn-lg shadow-xl shadow-primary/30 gap-2 px-10">
        Get Started — It's Free
        <ArrowRight className="size-5" />
      </Link>
      <div className="flex items-center justify-center gap-6 mt-8 text-sm text-base-content/60">
        <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> No credit card required</span>
        <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> Free forever plan</span>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 border-t border-base-content/5">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-black text-lg">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Code</span>st
          </span>
        </div>
        <p className="text-sm text-base-content/50">© 2026 Codest. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
