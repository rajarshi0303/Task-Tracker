import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

export default function TaskFormModal({
  isEdit = false,
  task = {},
  onSave,
  trigger,
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (open) {
      if (isEdit && task) {
        setTitle(task.title || "");
        setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
        setCompleted(task.completed || false);
      } else {
        resetForm();
      }
    }
  }, [open]);

  const resetForm = () => {
    setTitle("");
    setDueDate("");
    setCompleted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title,
      dueDate: dueDate || null,
      completed,
    };
    onSave(formData);
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="completed"
              checked={completed}
              onCheckedChange={setCompleted}
            />
            <Label htmlFor="completed">Completed</Label>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {isEdit ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
