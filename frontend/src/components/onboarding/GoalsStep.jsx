import { Check, Flag, Plus } from "lucide-react";
import { useState } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
const suggested = ["Placement Preparation", "Semester Exams", "Projects", "Internship", "Learning", "Research", "Personal Development"];
function GoalsStep({ nextStep, prevStep, data, updateData }) {
  const [priorities, setPriorities] = useState(data.priorities || []); const [custom, setCustom] = useState("");
  const toggle = (value) => setPriorities((items) => items.includes(value) ? items.filter((item) => item !== value) : [...items, value]);
  const addCustom = () => { if (custom.trim() && !priorities.includes(custom.trim())) { setPriorities((items) => [...items, custom.trim()]); setCustom(""); } };
  const handleNext = () => { if (!priorities.length) return; updateData({ priorities }); nextStep(); };
  return <section><header className="mb-7"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Flag size={20} /></div><h1 className="text-2xl font-semibold text-gray-900">Choose your priorities</h1><p className="mt-2 text-gray-500">Select every area that deserves protected time in your schedule.</p></header><div className="grid gap-3 sm:grid-cols-2">{suggested.map((item) => { const selected = priorities.includes(item); return <button type="button" onClick={() => toggle(item)} key={item} className={`flex min-h-16 items-center justify-between rounded-lg border px-4 text-left text-sm font-medium transition ${selected ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-700 hover:border-indigo-200"}`}><span>{item}</span>{selected && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white"><Check size={13} /></span>}</button>; })}</div><div className="mt-5 flex gap-2"><Input value={custom} onChange={(event) => setCustom(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addCustom()} placeholder="Add a custom priority" /><Button variant="secondary" onClick={addCustom} className="shrink-0 px-3" aria-label="Add custom priority"><Plus size={18} /></Button></div><footer className="mt-9 flex justify-between"><Button variant="secondary" onClick={prevStep}>Back</Button><Button onClick={handleNext} disabled={!priorities.length}>Continue</Button></footer></section>;
}
export default GoalsStep;
