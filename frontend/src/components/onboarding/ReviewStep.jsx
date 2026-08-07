import { CheckCircle2, Clock3, ListTodo, Pencil, Target } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProfile } from "../../services/profileService";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Badge from "../../ui/Badge";

function SummaryCard({ icon: Icon, title, children }) { return <Card className="p-4"><div className="mb-3 flex items-center gap-2 text-gray-800"><Icon size={18} className="text-indigo-500" /><h2 className="font-semibold">{title}</h2></div>{children}</Card>; }
function ReviewStep({ prevStep, data }) {
  const navigate = useNavigate(); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const handleFinish = async () => { setSaving(true); setError(""); try { await createProfile(data); navigate("/dashboard"); } catch (requestError) { setError(requestError.response?.data?.detail || "We could not save your preferences. Please try again."); setSaving(false); } };
  return <section><header className="mb-7"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 size={20} /></div><h1 className="text-2xl font-semibold text-gray-900">Your plan is ready to create</h1><p className="mt-2 text-gray-500">Review the inputs TinyPal will use to organize your week.</p></header><div className="grid gap-3 sm:grid-cols-2"><SummaryCard icon={ListTodo} title={`${data.tasks.length} tasks`}><div className="space-y-2">{data.tasks.slice(0, 3).map((task, index) => <p className="text-sm text-gray-600" key={`${task.title}-${index}`}>{task.title}</p>)}{data.tasks.length > 3 && <p className="text-sm text-gray-400">+{data.tasks.length - 3} more</p>}</div></SummaryCard><SummaryCard icon={Target} title="Priorities"><div className="flex flex-wrap gap-1.5">{data.priorities.map((priority) => <Badge key={priority}>{priority}</Badge>)}</div></SummaryCard><SummaryCard icon={Clock3} title="Schedule"><p className="text-sm text-gray-600">{data.commitments.length ? `${data.commitments.length} recurring commitments` : "No recurring commitments added"}</p></SummaryCard><SummaryCard icon={Pencil} title="Study preferences"><p className="text-sm text-gray-600">{data.preferred_study_time} · {data.daily_study_target} hours daily</p><p className="mt-1 text-sm text-gray-500">{data.wake_up_time} wake-up · {data.break_duration} min breaks</p></SummaryCard></div>{error && <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<footer className="mt-9 flex justify-between"><Button variant="secondary" onClick={prevStep} disabled={saving}>Back</Button><Button onClick={handleFinish} disabled={saving}>{saving ? "Creating your plan..." : "Create my plan"}</Button></footer></section>;
}
export default ReviewStep;
