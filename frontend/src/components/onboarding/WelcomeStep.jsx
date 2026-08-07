import { ArrowRight, CalendarClock, Sparkles } from "lucide-react";
import Button from "../../ui/Button";

function WelcomeStep({ nextStep }) {
  return <section className="py-5 text-center sm:py-10"><div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><CalendarClock size={38} strokeWidth={1.6} /></div><p className="mb-3 text-sm font-semibold text-indigo-600">PERSONAL PLANNING, SIMPLIFIED</p><h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">Build a week that works for you.</h1><p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-500">TinyPal turns your tasks, priorities, and fixed commitments into a schedule with room to focus and recharge.</p><div className="mt-9 flex justify-center"><Button onClick={nextStep}>Set up my workspace <ArrowRight size={17} /></Button></div><div className="mt-10 flex justify-center gap-2 text-sm text-gray-400"><Sparkles size={16} /> Takes about two minutes</div></section>;
}
export default WelcomeStep;
