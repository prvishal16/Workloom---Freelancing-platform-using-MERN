import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  KanbanSquare,
  MessageSquare,
  FileText,
  Briefcase,
  User,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";

export default function LandingPage() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-white text-gray-800 font-sans">
      <section className="relative text-center min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-grid-slate-100 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"></div>
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 text-sm font-bold text-blue-600 tracking-widest uppercase"
          >
            A Focused WorkLoom
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tighter max-w-4xl"
          >
            Where Client-Freelancer
            <br />
            Collaboration <span className="text-blue-600">Finally Clicks.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl"
          >
            Stop juggling emails, spreadsheets, and scattered chats. 
            Real-Time Freelance Collaboration Platform brings everything into one focused, professional
            workspace.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <Link
              to="/signup"
              className="group flex items-center justify-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Get Started for Free
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <p className="text-sm text-gray-500">No credit card required ✓</p>
          </motion.div>
        </div>
      </section>

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-blue-600 tracking-wider uppercase">
              The Platform
            </h2>
            <p className="mt-2 text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tighter">
              A Toolkit for Flawless Execution
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              From the first task to the final payment, stay aligned and
              productive with features designed for clarity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: KanbanSquare,
                title: "Visual Task Tracking",
                desc: "Use a simple Kanban board to see what's in progress, what's next, and what's done. No more guesswork.",
              },
              {
                icon: MessageSquare,
                title: "Real-Time Chat",
                desc: "Keep all project-related conversations in one place with a dedicated chat for every project.",
              },
              {
                icon: FileText,
                title: "Centralized File Hub",
                desc: "Upload briefs, share deliverables for review, and get approvals without ever leaving the platform.",
              },
              {
                icon: CheckCircle,
                title: "Seamless Payments",
                desc: "Freelancers submit invoices and clients pay securely upon project completion. Simple and transparent.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4 space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  For Clients
                </h2>
              </div>
              <p className="mt-4 text-lg text-gray-600">
                Gain clarity and confidence in your projects. Oversee progress,
                provide instant feedback, and manage everything effortlessly
                from a single dashboard.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />{" "}
                  <span>
                    View all your projects and their statuses at a glance.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />{" "}
                  <span>
                    Provide clear, contextual feedback directly on deliverables.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />{" "}
                  <span>
                    Securely handle all payments and invoices in one place.
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-100 p-8 rounded-xl shadow-inner">
              <img
                src="https://www.capgemini.com/wp-content/uploads/2021/07/Capgemini_client-stories.jpg"
                alt="Client Dashboard View"
                className="rounded-lg shadow-xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-last">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-green-600" />
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  For Freelancers
                </h2>
              </div>
              <p className="mt-4 text-lg text-gray-600">
                Focus on what you do best: delivering great work. Impress
                clients with a professional workflow, clear communication, and
                timely updates.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />{" "}
                  <span>
                    Manage all your client work without the clutter of your
                    inbox.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />{" "}
                  <span>
                    Set clear expectations and prevent scope creep with
                    structured tasks.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />{" "}
                  <span>
                    Get paid on time, every time, with integrated invoicing.
                  </span>
                </li>
              </ul>
            </div>
            <div className="lg:order-first bg-slate-100 p-8 rounded-xl shadow-inner">
              <img
                src="https://www.hrmanagementapp.com/wp-content/uploads/2019/06/freelancer-2.jpg"
                alt="Freelancer Task View"
                className="rounded-lg shadow-xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 bg-gray-900 text-white"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
              Don't just take our word for it.
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
              See how professionals are streamlining their workflow and building
              better partnerships.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
              <p className="text-lg text-gray-300 italic">
                "Before this, managing freelance projects was a nightmare of
                email chains and lost files. The Hub brought sanity and clarity.
                I can see progress instantly, and my freelancers love the
                streamlined process."
              </p>
              <div className="mt-6 flex items-center">
                <img
                  src="/avatar-sarah.jpg"
                  alt="Sarah L."
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <p className="font-semibold text-white">Sarah Lee</p>
                  <p className="text-gray-400">Marketing Director, Acme Inc.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
              <p className="text-lg text-gray-300 italic">
                "This platform is a game-changer. It shows my clients I'm
                professional and organized. The clear task list prevents scope
                creep, and getting paid through the platform is incredibly
                simple. Highly recommend."
              </p>
              <div className="mt-6 flex items-center">
                <img
                  src="/avatar-david.jpg"
                  alt="David Chen"
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <p className="font-semibold text-white">David Chen</p>
                  <p className="text-gray-400">Freelance Web Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <div className="relative text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-2xl p-12 overflow-hidden">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
              Ready to Build Your Best Work?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100">
              Bring focus and professionalism to your freelance projects today.
              Sign up in seconds.
            </p>
            <div className="mt-8">
              <Link
                to="/signup"
                className="inline-block px-10 py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-lg font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Collaborating Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <h3 className="text-lg font-bold text-white">
              WorkLoom - Freelance Collaboration Platform
              </h3>
              <p className="mt-2 text-sm">
                The focused workspace for clients and freelancers to achieve
                project clarity.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="hover:text-white">
                  <Twitter size={20} />
                </a>
                <a href="#" className="hover:text-white">
                  <Github size={20} />
                </a>
                <a href="#" className="hover:text-white">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Product
                </h4>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link
                      to="/features"
                      className="hover:text-white transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pricing"
                      className="hover:text-white transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="hover:text-white transition-colors"
                    >
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Company
                </h4>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link
                      to="/about"
                      className="hover:text-white transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      className="hover:text-white transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="hover:text-white transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Legal
                </h4>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link
                      to="/privacy"
                      className="hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="hover:text-white transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} P R Vishal - Freelance Collaboration Platform. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
