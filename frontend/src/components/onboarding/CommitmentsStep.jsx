import { CalendarDays, Check, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Badge from "../../ui/Badge";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const categories = ["Class", "Work", "Meeting", "Personal", "Exercise", "Other"];

function CommitmentsStep({ nextStep, prevStep, data, updateData }) {
  const [entry, setEntry] = useState({ days: [], start: "", end: "", title: "", category: "Class" });
  const [commitments, setCommitments] = useState(data.commitments || []); const [error, setError] = useState("");
  const setField = (event) => setEntry((current) => ({ ...current, [event.target.name]: event.target.value }));
  const toggleDay = (day) => setEntry((current) => ({ ...current, days: current.days.includes(day) ? current.days.filter((item) => item !== day) : [...current.days, day] }));
  const add = () => {
    if (!entry.days.length || !entry.start || !entry.end || !entry.title.trim()) { setError("Select at least one day, then enter a title, start time, and end time."); return; }
    if (entry.end <= entry.start) { setError("End time must be after start time."); return; }
    setError(""); setCommitments((items) => [...items, ...entry.days.map((day) => ({ day, start: entry.start, end: entry.end, title: entry.title.trim(), category: entry.category }))]);
    setEntry({ days: [], start: "", end: "", title: "", category: "Class" });
  };
  return <section><header className="mb-7"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"><CalendarDays size={20} /></div><h1 className="text-2xl font-semibold text-gray-900">When are you already busy?</h1><p className="mt-2 text-gray-500">Select one or more days for each recurring commitment. This step is optional.</p></header><Card className="p-4"><div className="grid gap-3 sm:grid-cols-2"><Input name="title" value={entry.title} onChange={setField} placeholder="Commitment title" /><Select name="category" value={entry.category} onChange={setField}>{categories.map((category) => <option key={category}>{category}</option>)}</Select><Input name="start" type="time" value={entry.start} onChange={setField} /><Input name="end" type="time" value={entry.end} onChange={setField} /></div><p className="mt-4 text-sm font-medium text-gray-700">Repeats on</p><div className="mt-2 flex flex-wrap gap-2">{days.map((day) => { const selected = entry.days.includes(day); return <button type="button" key={day} onClick={() => toggleDay(day)} className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium ${selected ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-indigo-300"}`}>{selected && <Check size={14} />}{day.slice(0, 3)}</button>; })}</div><Button onClick={add} className="mt-4"><Plus size={17} /> Add commitment</Button></Card>{error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}<div className="mt-4 space-y-2">{commitments.map((item, index) => <Card key={`${item.title}-${index}`} className="flex items-center justify-between p-3.5"><div><p className="font-medium text-gray-800">{item.title}</p><p className="mt-1 text-sm text-gray-500">{item.day} · {item.start}–{item.end}</p><Badge className="mt-1.5">{item.category}</Badge></div><Button variant="danger" onClick={() => setCommitments(commitments.filter((_, position) => position !== index))} className="min-h-9 px-2" aria-label={`Remove ${item.title}`}><Trash2 size={17} /></Button></Card>)}</div><footer className="mt-9 flex justify-between"><Button variant="secondary" onClick={prevStep}>Back</Button><Button onClick={() => { updateData({ commitments }); nextStep(); }}>Continue</Button></footer></section>;
}
export default CommitmentsStep;
