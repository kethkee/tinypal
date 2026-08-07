import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Badge from "../../ui/Badge";
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const categories = ["Class", "Work", "Meeting", "Personal", "Exercise", "Other"];
function CommitmentsStep({ nextStep, prevStep, data, updateData }) {
  const [entry, setEntry] = useState({ day: "", start: "", end: "", title: "", category: "Class" }); const [commitments, setCommitments] = useState(data.commitments || []);
  const setField = (event) => setEntry((current) => ({ ...current, [event.target.name]: event.target.value }));
  const add = () => { if (!entry.day || !entry.start || !entry.end || !entry.title.trim()) return; setCommitments((items) => [...items, entry]); setEntry({ day: "", start: "", end: "", title: "", category: "Class" }); };
  return <section><header className="mb-7"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600"><CalendarDays size={20} /></div><h1 className="text-2xl font-semibold text-gray-900">When are you already busy?</h1><p className="mt-2 text-gray-500">Add recurring commitments so your plan stays realistic. This step is optional.</p></header><Card className="p-4"><div className="grid gap-3 sm:grid-cols-2"><Input name="title" value={entry.title} onChange={setField} placeholder="Commitment title" /><Select name="day" value={entry.day} onChange={setField}><option value="">Day</option>{days.map((day) => <option key={day}>{day}</option>)}</Select><Input name="start" type="time" value={entry.start} onChange={setField} /><Input name="end" type="time" value={entry.end} onChange={setField} /><Select name="category" value={entry.category} onChange={setField}>{categories.map((category) => <option key={category}>{category}</option>)}</Select><Button onClick={add}><Plus size={17} /> Add commitment</Button></div></Card><div className="mt-4 space-y-2">{commitments.map((item, index) => <Card key={`${item.title}-${index}`} className="flex items-center justify-between p-3.5"><div><p className="font-medium text-gray-800">{item.title}</p><p className="mt-1 text-sm text-gray-500">{item.day} · {item.start} - {item.end}</p><Badge className="mt-1.5">{item.category}</Badge></div><Button variant="danger" onClick={() => setCommitments(commitments.filter((_, position) => position !== index))} className="min-h-9 px-2" aria-label={`Remove ${item.title}`}><Trash2 size={17} /></Button></Card>)}</div><footer className="mt-9 flex justify-between"><Button variant="secondary" onClick={prevStep}>Back</Button><Button onClick={() => { updateData({ commitments }); nextStep(); }}>Continue</Button></footer></section>;
}
export default CommitmentsStep;
