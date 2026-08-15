"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight, ArrowUpRight, BarChart3, Bot, Check, ChevronDown, CircleDollarSign,
  Clock3, Code2, Database, Gauge, Github, Globe2, Layers3, Mail,
  Menu, MessageCircle, Phone, Rocket, ShieldCheck, Sparkles, Target,
  Workflow, X, Zap,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: .65, ease: "easeOut" as const } },
};

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} transition={{ delay }}>{children}</motion.div>;
}

const services = [
  { icon: Workflow, title: "Business Automation", text: "Remove repetitive work and connect your operations into one reliable workflow.", benefit: "Save hours every week" },
  { icon: Layers3, title: "Custom Web Applications", text: "Purpose-built software shaped around how your team and customers actually work.", benefit: "Operate without workarounds" },
  { icon: Bot, title: "AI Integrations", text: "Practical AI that handles support, documents, insights and routine decision-making.", benefit: "Do more with the same team" },
  { icon: BarChart3, title: "Dashboards & Portals", text: "Give your team and customers a clear, secure place to take action and see results.", benefit: "Make faster decisions" },
  { icon: Database, title: "CRM & Internal Tools", text: "Bring customer data, sales activity and daily operations into one source of truth.", benefit: "Never lose an opportunity" },
  { icon: CircleDollarSign, title: "Commerce & Payments", text: "Smooth ordering, bookings and payment experiences that turn demand into revenue.", benefit: "Convert more customers" },
];

const projects = [
  { number: "01", name: "Savoury", type: "Restaurant operations", title: "One platform. Every order under control.", copy: "A complete ordering and operations system that connects customers, kitchen teams and management in real time.", result: "Ordering and operations in one workflow", color: "blue", tags: ["Online ordering", "Kitchen display", "Analytics"], liveUrl: "https://savoury-ten.vercel.app/" },
  { number: "02", name: "HarvestNearU", type: "Local produce marketplace", title: "Fresh local produce, found closer to home.", copy: "A marketplace that helps customers discover fresh produce from trusted nearby farmers, with convenient pickup and doorstep delivery.", result: "Direct farmer-to-buyer access", color: "purple", tags: ["Marketplace", "Local discovery", "Ordering"], liveUrl: "https://www.harvestnearu.com/" },
];

const faqs = [
  ["How long does a typical project take?", "Focused builds usually take 4–8 weeks. Larger platforms are planned in phases so you can launch useful features earlier and start seeing value sooner."],
  ["How much does custom software cost?", "Every project is scoped around the business outcome, complexity and timeline. After a free discovery call, you receive a clear proposal with fixed milestones—no vague estimates."],
  ["Will I own the software and source code?", "Yes. Once the project is paid for, you own the custom code and product assets created for your business."],
  ["Can you improve a system we already use?", "Absolutely. I can audit an existing product, resolve bottlenecks, modernise its experience or build integrations around it."],
  ["What happens after launch?", "You receive launch support, documentation and training. Ongoing maintenance and improvement plans are available when you want a long-term technical partner."],
];

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.email("Enter a valid email"),
  company: z.string().optional(),
  stage: z.string().optional(),
  service: z.string().min(1, "Choose a service"),
  message: z.string().min(20, "Tell me a little more (at least 20 characters)"),
  website: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function Portfolio() {
  const whatsappUrl = "https://wa.me/2349022301666?text=Hello%20Victor%2C%20I%27d%20like%20to%20discuss%20a%20project%20with%20you.";
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [menu, setMenu] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });
  const submit = async (values: FormData) => {
    setSubmitError("");
    const session = sessionStorage.getItem("victor_session") || crypto.randomUUID();
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "content-type": "application/json", "x-session-id": session }, body: JSON.stringify(values) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { setSubmitError(result.error || "Something went wrong. Please try again."); return; }
      setSent(true); reset();
    } catch { setSubmitError("You appear to be offline. Please reconnect and try again, or contact us directly."); }
  };

  useEffect(() => {
    const close = () => setMenu(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return <main>
    <motion.div className="scroll-progress" style={{ scaleX: progress }} />
    <div className="noise" />

    <header className="nav-wrap">
      <nav className="nav container" aria-label="Main navigation">
        <BrandLogo href="#top" compact />
        <div className="nav-links">
          <a href="#services">Services</a><a href="#work">Work</a><a href="#founder">Founder</a><a href="#process">Process</a>
        </div>
        <a href="#contact" className="btn btn-small">Let&apos;s talk <ArrowUpRight size={16} /></a>
        <button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X /> : <Menu />}</button>
      </nav>
      {menu && <motion.div className="mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <a href="#services">Services</a><a href="#work">Work</a><a href="#founder">Founder</a><a href="#process">Process</a><a href="#contact">Let&apos;s talk</a>
      </motion.div>}
    </header>

    <section id="top" className="hero section">
      <div className="orb orb-one"/><div className="orb orb-two"/>
      <div className="grid-bg" />
      <div className="container hero-grid">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: .1 } } }}>
          <motion.div variants={fade} className="eyebrow"><span className="pulse"/> Available for select projects</motion.div>
          <motion.h1 variants={fade}>I build business systems that <span className="gradient-text">create momentum.</span></motion.h1>
          <motion.p variants={fade} className="hero-copy">Replace manual work with powerful web applications, automation and AI—built around your workflow, your customers and your next stage of growth.</motion.p>
          <motion.div variants={fade} className="hero-actions">
            <a href="#contact" className="btn btn-primary" data-track="hero_consultation">Book a free consultation <ArrowRight size={18}/></a>
            <a href="#work" className="btn btn-ghost" data-track="hero_work">See the work <ArrowUpRight size={18}/></a>
          </motion.div>
          <motion.div variants={fade} className="proof-row">
            <div className="avatars"><span>AD</span><span>MK</span><span>JO</span></div>
            <div><div className="stars">★★★★★</div><p>Trusted by ambitious business owners</p></div>
          </motion.div>
        </motion.div>
        <motion.div className="hero-visual" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .25 }}>
          <div className="visual-glow"/>
          <motion.div className="float-card float-top" animate={{ y: [0,-8,0] }} transition={{ duration: 4, repeat: Infinity }}><span className="icon-box green"><Check size={16}/></span><div><b>Workflow automated</b><small>14 hours saved this week</small></div></motion.div>
          <div className="dashboard">
            <div className="dash-top"><div className="mini-logo">V</div><div className="dash-search"/><div className="dash-avatar"/></div>
            <div className="dash-body">
              <div className="dash-side"><i/><i/><i/><i/><i/></div>
              <div className="dash-main"><span className="dash-label">PERFORMANCE OVERVIEW</span><h3>Your business, at a glance.</h3>
                <div className="metric-row"><div><small>Revenue</small><b>$128,400</b><em>+18.4%</em></div><div><small>Orders</small><b>2,841</b><em>+12.7%</em></div></div>
                <div className="chart"><div className="chart-lines"/><svg viewBox="0 0 500 130" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#52a8ff" stopOpacity=".4"/><stop offset="1" stopColor="#52a8ff" stopOpacity="0"/></linearGradient></defs><path d="M0,105 C40,90 60,100 95,75 S150,90 190,55 S245,65 280,42 S340,58 380,30 S440,42 500,8 L500,130 L0,130Z" fill="url(#area)"/><path d="M0,105 C40,90 60,100 95,75 S150,90 190,55 S245,65 280,42 S340,58 380,30 S440,42 500,8" fill="none" stroke="#5bb5ff" strokeWidth="3"/></svg></div>
                <div className="activity"><span/><div><b>New customer order</b><small>Just now · $248.00</small></div><strong>View</strong></div>
              </div>
            </div>
          </div>
          <motion.div className="float-card float-bottom" animate={{ y: [0,8,0] }} transition={{ duration: 4.5, repeat: Infinity }}><div className="ring">84%</div><div><b>Operations health</b><small>Everything is running smoothly</small></div></motion.div>
        </motion.div>
      </div>
      <div className="container stats">
        {[['Full-stack','From strategy to deployment'],['Business-first','Technology tied to outcomes'],['5+ years','Building digital products'],['Global','Remote collaboration from Lagos']].map(([a,b])=><div key={b}><strong>{a}</strong><span>{b}</span></div>)}
      </div>
    </section>

    <section className="section problems">
      <div className="container">
        <Reveal className="section-heading centered"><span className="kicker">THE REAL COST OF “GOOD ENOUGH”</span><h2>Your business shouldn&apos;t be held back by <span className="muted">busywork.</span></h2><p>Growth gets expensive when your team is stuck fighting spreadsheets, disconnected tools and repetitive processes.</p></Reveal>
        <div className="problem-grid">
          {[['Clock3','Hours lost to repetitive admin'],['Target','Leads slipping through the cracks'],['Gauge','No clear view of performance'],['Zap','Slow systems frustrating customers'],['ShieldCheck','Mistakes caused by manual processes'],['Database','Critical data scattered everywhere']].map(([icon,title],i)=>{
            const icons = {Clock3,Target,Gauge,Zap,ShieldCheck,Database}; const Icon=icons[icon as keyof typeof icons];
            return <Reveal key={title} delay={i*.04}><div className="problem-card"><Icon/><span>{title}</span><ArrowUpRight/></div></Reveal>})}
        </div>
        <Reveal><div className="solution-line"><Sparkles/><p>That&apos;s where I come in. <span>I turn operational friction into software that gives your business an unfair advantage.</span></p></div></Reveal>
      </div>
    </section>

    <section id="services" className="section services">
      <div className="container">
        <Reveal className="section-heading"><span className="kicker">CAPABILITIES</span><h2>How I help businesses <span className="gradient-text">grow.</span></h2><p>Not off-the-shelf software. Focused systems designed to reduce costs, improve customer experience and unlock scale.</p></Reveal>
        <div className="service-grid">{services.map((s,i)=><Reveal key={s.title} delay={i*.04}><article className="service-card"><div className="service-icon"><s.icon/></div><span className="card-number">0{i+1}</span><h3>{s.title}</h3><p>{s.text}</p><div className="benefit"><Check size={15}/>{s.benefit}</div></article></Reveal>)}</div>
      </div>
    </section>

    <section id="work" className="section work">
      <div className="container">
        <Reveal className="section-heading split"><div><span className="kicker">SELECTED WORK</span><h2>Built for measurable <span className="muted">impact.</span></h2></div><p>Every product starts with a business problem and ends with a result you can see, measure and build on.</p></Reveal>
        <div className="projects">{projects.map((p,i)=><Reveal key={p.name}><article className={`project project-${p.color}`}>
          <div className="project-copy"><span className="project-index">{p.number} / CASE STUDY</span><div className="project-brand"><span>{p.name[0]}</span><div><b>{p.name}</b><small>{p.type}</small></div></div><h3>{p.title}</h3><p>{p.copy}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div><div className="result"><Rocket size={18}/><div><small>BUSINESS RESULT</small><b>{p.result}</b></div></div>{p.liveUrl?<a className="text-link" href={p.liveUrl} target="_blank" rel="noopener noreferrer" data-track={p.name} data-event="project_view">Visit live project <ArrowUpRight size={17}/></a>:<span className="text-link text-link-muted">Case study coming soon</span>}</div>
          <div className="project-visual"><div className="app-window"><div className="window-bar"><i/><i/><i/></div><div className="app-shell"><div className="app-nav"><b>{p.name[0]}</b><i/><i/><i/><i/></div><div className="app-content"><span>OVERVIEW</span><h4>{i===0?'Good evening, Victor':i===1?'Marketplace overview':'Sales pipeline'}</h4><div className="app-metrics"><i/><i/><i/></div><div className="app-chart"><span/><span/><span/><span/><span/><span/><span/></div><div className="app-table"><i/><i/><i/></div></div></div></div></div>
        </article></Reveal>)}</div>
      </div>
    </section>

    <section id="process" className="section process"><div className="container">
      <Reveal className="section-heading centered"><span className="kicker">A CLEAR, PROVEN PROCESS</span><h2>From idea to impact—<span className="muted">without the chaos.</span></h2><p>You always know what&apos;s happening, what&apos;s next and why it matters.</p></Reveal>
      <div className="timeline">{[['01','Discover','We uncover the real problem, the users and the outcome worth building for.'],['02','Strategise','I turn your goals into a focused roadmap, clear scope and success measures.'],['03','Design','You see and shape the experience before development begins.'],['04','Build','The system comes to life in visible, testable milestones.'],['05','Launch & grow','We launch confidently, measure results and keep improving.']].map(([n,t,c],i)=><Reveal key={t} delay={i*.04}><div className="step"><span>{n}</span><div className="step-dot"/><h3>{t}</h3><p>{c}</p></div></Reveal>)}</div>
    </div></section>

    <section id="about" className="section why"><div className="container why-grid">
      <Reveal><div className="section-heading"><span className="kicker">WHY WORK WITH ME</span><h2>A technical partner who thinks like a <span className="gradient-text">business owner.</span></h2><p>Great software is more than clean code. It&apos;s a clear understanding of the people, process and commercial outcome behind every feature.</p></div><div className="quote"><span>“</span><p>I don&apos;t measure success by features shipped. I measure it by time saved, friction removed and opportunities created.</p></div></Reveal>
      <div className="why-list">{[
        { Icon: Target, title: 'Business before technology', copy: 'Every decision connects back to a real operational or commercial goal.' },
        { Icon: MessageCircle, title: 'Clear, proactive communication', copy: 'No disappearing acts or technical fog. You always know where things stand.' },
        { Icon: Zap, title: 'Speed without shortcuts', copy: 'Focused execution, robust foundations and momentum from the first week.' },
        { Icon: ShieldCheck, title: 'Built to last and scale', copy: 'Secure, maintainable systems that grow with your operation.' },
      ].map(({Icon,title,copy},i)=><Reveal key={title} delay={i*.05}><div className="why-item"><div><Icon/></div><section><h3>{title}</h3><p>{copy}</p></section><span>0{i+1}</span></div></Reveal>)}</div>
    </div></section>

    <section id="founder" className="section founder"><div className="founder-orb"/><div className="container founder-grid">
      <Reveal className="founder-portrait-wrap"><div className="founder-frame"><Image src="/victor-founder.png" alt="Victor Tonye Iyoyo, founder and CEO of Navill Tech" fill sizes="(max-width: 900px) 100vw, 45vw" className="founder-photo" priority={false}/><div className="founder-image-shade"/><div className="founder-badge"><span>VI</span><div><small>FOUNDER &amp; CEO</small><b>Victor Tonye Iyoyo</b></div></div></div><div className="founder-accent-card"><Sparkles/><span>Building technology around real business outcomes.</span></div></Reveal>
      <Reveal><div className="section-heading founder-copy"><span className="kicker">MEET THE FOUNDER</span><h2>Technical depth. <span className="gradient-text">Business instinct.</span></h2><p className="founder-intro">I&apos;m Victor Tonye Iyoyo, founder and CEO of Navill Tech—a full-stack developer focused on turning operational challenges into clear, scalable digital products.</p><p>Over the past five years, I&apos;ve designed and delivered web applications, marketplaces, restaurant systems, dashboards and automation workflows from initial concept through deployment. My work sits at the intersection of product thinking, thoughtful design and reliable engineering.</p><p>I founded Navill Tech with a simple belief: software should do more than look impressive. It should remove friction, improve the customer experience and create measurable room for a business to grow.</p></div><div className="founder-stats"><div><strong>5+</strong><span>Years building digital products</span></div><div><strong>Full-stack</strong><span>Strategy through deployment</span></div><div><strong>Lagos</strong><span>Serving businesses globally</span></div></div><div className="founder-signoff"><div className="signature">Victor.</div><div><b>Victor Tonye Iyoyo</b><small>Founder &amp; CEO, Navill Tech</small></div></div></Reveal>
    </div></section>

    <section className="section tech"><div className="container"><Reveal className="section-heading centered"><span className="kicker">MODERN. RELIABLE. PROVEN.</span><h2>The right tools for the job.</h2><p>A modern technology stack chosen for speed, security and long-term maintainability.</p></Reveal><Reveal><div className="tech-cloud">{['React','Next.js','TypeScript','Node.js','PostgreSQL','Supabase','Tailwind CSS','REST APIs','Stripe','Cloud'].map((t,i)=><div key={t} className={`tech-pill p${i%4}`}><Code2 size={17}/>{t}</div>)}</div></Reveal></div></section>

    <section className="section faq"><div className="container faq-grid"><Reveal className="section-heading"><span className="kicker">FREQUENTLY ASKED</span><h2>Good questions. <span className="muted">Clear answers.</span></h2><p>Still wondering if this is the right fit?</p><a href="#contact" className="text-link">Let&apos;s talk it through <ArrowRight size={17}/></a></Reveal><div className="accordion">{faqs.map(([q,a],i)=><div className={`faq-item ${faq===i?'open':''}`} key={q}><button onClick={()=>setFaq(faq===i?null:i)} aria-expanded={faq===i}><span>{q}</span><ChevronDown/></button>{faq===i&&<motion.p initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}>{a}</motion.p>}</div>)}</div></div></section>

    <section id="contact" className="section contact"><div className="contact-glow"/><div className="container contact-grid"><Reveal><div className="section-heading"><span className="kicker">START A CONVERSATION</span><h2>Let&apos;s build the system your business <span className="gradient-text">deserves.</span></h2><p>Tell me what&apos;s slowing you down or where you want to go next. You&apos;ll get honest direction, clear next steps and no hard sell.</p></div><div className="contact-points"><a href="mailto:victoriyoyo2493@gmail.com" data-track="email" data-event="contact_click"><Mail/><div><small>EMAIL</small><b>victoriyoyo2493@gmail.com</b></div></a><a href="tel:+2349022301666" data-track="phone" data-event="contact_click"><Phone/><div><small>PHONE</small><b>+234 902 230 1666</b></div></a><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat with Victor on WhatsApp" data-track="whatsapp" data-event="contact_click"><MessageCircle/><div><small>WHATSAPP</small><b>Chat with Victor</b></div></a></div><div className="availability"><span className="pulse"/><div><b>Currently accepting new projects</b><small>Typical response time: within 24 hours</small></div></div></Reveal>
      <Reveal><form onSubmit={handleSubmit(submit)} className="contact-form"><div className="form-top"><div><span>Tell me about your project</span><small>All fields marked * are required</small></div><Sparkles/></div><input className="form-honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" {...register('website')} /><div className="form-row"><label>Your name *<input {...register('name')} placeholder="e.g. Sarah Johnson"/>{errors.name&&<em>{errors.name.message}</em>}</label><label>Work email *<input {...register('email')} placeholder="sarah@company.com"/>{errors.email&&<em>{errors.email.message}</em>}</label></div><label>Company<input {...register('company')} placeholder="Your company name"/></label><div className="form-row"><label>What do you need? *<select defaultValue="" {...register('service')}><option value="" disabled>Select a service</option><option>Custom web application</option><option>Business automation</option><option>AI integration</option><option>Dashboard or portal</option><option>Something else</option></select>{errors.service&&<em>{errors.service.message}</em>}</label><label>What stage are you at?<select defaultValue="" {...register('stage')}><option value="">Select a stage (optional)</option><option>I have an idea to explore</option><option>I need help defining the solution</option><option>I&apos;m ready to start</option><option>I&apos;m replacing an existing system</option><option>I need improvements to an existing product</option><option>I&apos;m not sure yet</option></select></label></div><label>Tell me about the challenge *<textarea {...register('message')} rows={5} placeholder="What is happening today, and what would a great outcome look like?"/>{errors.message&&<em>{errors.message.message}</em>}</label>{submitError&&<p className="form-error" role="alert">{submitError}</p>}<button className="btn btn-primary form-submit" disabled={isSubmitting}>{isSubmitting?'Sending your enquiry…':sent?'Message received — thank you!':'Send project enquiry'} {!isSubmitting&&!sent&&<ArrowRight size={18}/>}</button><p className="privacy"><ShieldCheck size={14}/> Your details are private and will never be shared.</p></form></Reveal>
    </div></section>

    <a className="whatsapp-float" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat with Victor on WhatsApp" data-track="floating_whatsapp" data-event="contact_click"><MessageCircle/><span>Chat on WhatsApp</span></a>
    <footer><div className="container footer-top"><div><BrandLogo href="#top"/><p>Business systems that save time, increase revenue and create room to grow.</p></div><div><b>Explore</b><a href="#services">Services</a><a href="#work">Selected work</a><a href="#founder">Founder</a><a href="#process">Process</a></div><div><b>Connect</b><a href="https://github.com/OluwatosinOgunfile" target="_blank" rel="noopener noreferrer"><Github size={14}/> GitHub</a><a href="mailto:victoriyoyo2493@gmail.com"><Mail size={14}/> Email</a><a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={14}/> WhatsApp</a></div><a href="#top" className="to-top" aria-label="Back to top"><ArrowUpRight/></a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Navill Tech. All rights reserved.</span><span>Founded by Victor Tonye Iyoyo. <Globe2 size={14}/></span></div></footer>
  </main>;
}
