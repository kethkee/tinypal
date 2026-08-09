import { Plus, Trash2, ListTodo } from "lucide-react";
import { useState } from "react";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Badge from "../../ui/Badge";
const categories = ["Assignment", "Project", "Study Topic", "Placement", "Internship", "Meeting", "Personal", "Reminder", "Other"];
function SubjectsStep({ nextStep, prevStep, data, updateData }) {
  const [task, setTask] = useState(""); const [category, setCategory] = useState("Assignment"); const [tasks, setTasks] = useState(data.tasks || []);
  const addTask = () => { if (!task.trim()) return; setTasks((items) => [...items, { title: task.trim(), category }]); setTask(""); };
  const handleNext = () => { if (!tasks.length) return; updateData({ tasks }); nextStep(); };
  return <section><header className="mb-7"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><ListTodo size={20} /></div><h1 className="text-2xl font-semibold text-gray-900">What is on your plate?</h1><p className="mt-2 text-gray-500">Add everything you want TinyPal to make space for. You can refine details later.</p></header><div className="grid gap-3 sm:grid-cols-[1fr_170px_auto]"><Input value={task} onChange={(event) => setTask(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addTask()} placeholder="e.g. Complete data structures assignment" /><Select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</Select><Button onClick={addTask} className="sm:px-3" aria-label="Add task"><Plus size={18} /><span className="sm:hidden">Add task</span></Button></div><div className="mt-5 space-y-2">{tasks.length ? tasks.map((item, index) => <Card key={`${item.title}-${index}`} className="flex items-center justify-between p-3.5"><div><p className="font-medium text-gray-800">{item.title}</p><Badge className="mt-1.5">{item.category}</Badge></div><Button variant="danger" onClick={() => setTasks(tasks.filter((_, position) => position !== index))} className="min-h-9 px-2" aria-label={`Remove ${item.title}`}><Trash2 size={17} /></Button></Card>) : <div className="rounded-lg border border-dashed border-gray-300 py-9 text-center text-sm text-gray-400">Your tasks will appear here.</div>}</div><footer className="mt-9 flex justify-between"><Button variant="secondary" onClick={prevStep}>Back</Button><Button onClick={handleNext} disabled={!tasks.length}>Continue</Button></footer></section>;
}
export default SubjectsStep;
