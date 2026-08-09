import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  Sparkles,
  Target,
} from "lucide-react";

import { Link } from "react-router-dom";

import Button from "../../ui/Button";

const floatingObjects = [
  {
    icon: CheckCircle2,
    text: "Task completed",
    x: "8%",
    y: "18%",
    delay: 0,
    duration: 5.5,
  },
  {
    icon: CalendarDays,
    text: "Plan your week",
    x: "70%",
    y: "14%",
    delay: 1.5,
    duration: 6,
  },
  {
    icon: Clock3,
    text: "Focus time",
    x: "2%",
    y: "64%",
    delay: 2.5,
    duration: 5,
  },
  {
    icon: Target,
    text: "Priority focus",
    x: "74%",
    y: "66%",
    delay: 0.8,
    duration: 6.5,
  },
  {
    icon: BookOpen,
    text: "Study smarter",
    x: "18%",
    y: "82%",
    delay: 3,
    duration: 5.8,
  },
  {
    icon: ListTodo,
    text: "Stay organized",
    x: "67%",
    y: "83%",
    delay: 2,
    duration: 6.2,
  },
];

const sparklePositions = [
  ["14%", "12%", 0],
  ["82%", "17%", 1.2],
  ["6%", "43%", 0.7],
  ["91%", "48%", 1.8],
  ["22%", "73%", 2.4],
  ["79%", "78%", 1.5],
  ["48%", "7%", 2.8],
  ["52%", "91%", 0.4],
];

function FloatingObject({
  icon: Icon,
  text,
  x,
  y,
  delay,
  duration,
}) {
  return (
    <motion.div
      className="absolute hidden sm:block"
      style={{
        left: x,
        top: y,
      }}
      initial={{
        opacity: 0,
        scale: 0.75,
        y: 20,
      }}
      animate={{
        opacity: [0, 1, 0.75, 1, 0],
        scale: [0.75, 1, 1, 1, 0.75],
        y: [20, 0, -8, 0, -15],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "easeInOut",
      }}
    >
      <div className="relative flex items-center gap-3 rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-[0_12px_35px_rgba(91,76,180,0.10)] backdrop-blur-xl">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eeeaff] text-[#7567d8]">
          <Icon size={17} strokeWidth={1.8} />
        </div>

        <span className="whitespace-nowrap text-sm font-medium text-[#5c586d]">
          {text}
        </span>

        {/* tiny glow */}
        <div className="absolute -inset-1 -z-10 rounded-2xl bg-violet-200/20 blur-lg" />
      </div>
    </motion.div>
  );
}

function TinySparkle({ left, top, delay }) {
  return (
    <motion.div
      className="absolute hidden sm:block text-[#8d7fe4]"
      style={{
        left,
        top,
      }}
      animate={{
        opacity: [0.1, 0.8, 0.2, 0.9, 0.1],
        scale: [0.6, 1.2, 0.7, 1, 0.6],
        rotate: [0, 45, 90, 135, 180],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Sparkles size={12} />
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[calc(100svh-72px)] overflow-hidden">

      {/* Very soft center glow */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-200/25 blur-[100px]"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating productivity objects */}
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-7xl">
        {floatingObjects.map((item) => (
          <FloatingObject
            key={item.text}
            {...item}
          />
        ))}

        {/* Sparkle particles */}
        {sparklePositions.map(
          ([left, top, delay], index) => (
            <TinySparkle
              key={index}
              left={left}
              top={top}
              delay={delay}
            />
          )
        )}
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] max-w-4xl items-center justify-center px-6 py-24 text-center">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            filter: "blur(8px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >

          {/* TinyPal label */}
          <motion.div
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-white/60 px-4 py-2 text-sm font-medium text-[#7567d8] backdrop-blur-md"
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles size={15} />
            Your calm productivity companion
          </motion.div>

          {/* Main heading */}
          <h1 className="mt-7 text-5xl font-semibold tracking-[-0.045em] text-[#17152a] sm:text-6xl md:text-7xl">

            <span className="block tiny-text-reveal">
              Make space for
            </span>

            <motion.span
              className="mt-1 block text-[#7567d8]"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0.8],
              }}
              transition={{
                duration: 2,
                delay: 0.4,
              }}
            >
              what matters.
            </motion.span>

          </h1>

          {/* Description */}
          <motion.p
            className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#716d82] sm:text-xl"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.8,
              duration: 0.8,
            }}
          >
            TinyPal turns your tasks, priorities, commitments and
            available time into a plan that fits your real day.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="mt-10 flex justify-center"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1.1,
              duration: 0.7,
            }}
          >
            <Link to="/signup">
              <Button className="px-7 py-3.5">
                Start planning
                <ArrowRight size={17} />
              </Button>
            </Link>
          </motion.div>

          {/* Bottom message */}
          <motion.div
            className="mt-8 flex items-center justify-center gap-2 text-sm text-[#8a8698]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1.5,
              duration: 1,
            }}
          >
            <CalendarDays size={16} className="text-[#8b7ce8]" />
            Built around your real day.
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

export default Hero;