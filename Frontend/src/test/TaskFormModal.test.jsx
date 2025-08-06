import { render, screen } from "@testing-library/react";
import TaskFormModal from "@/components/task/TaskFormModal";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

describe("TaskFormModal", () => {
  it("renders modal and submits form", async () => {
    const mockOnSave = vi.fn();

    render(
      <TaskFormModal
        onSave={mockOnSave}
        trigger={<button>Open Modal</button>}
      />,
    );

    const openBtn = screen.getByText("Open Modal");
    await userEvent.click(openBtn);

    const titleInput = screen.getByLabelText("Title");
    const dueDateInput = screen.getByLabelText("Due Date");
    const completedSwitch = screen.getByLabelText("Completed");

    await userEvent.type(titleInput, "New Task");
    await userEvent.type(dueDateInput, "2025-08-15");
    await userEvent.click(completedSwitch);

    const submitButton = screen.getByRole("button", { name: /create task/i });
    await userEvent.click(submitButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      title: "New Task",
      dueDate: "2025-08-15",
      completed: true,
    });
  });

  it("prefills data when editing", async () => {
    const mockOnSave = vi.fn();

    render(
      <TaskFormModal
        isEdit
        task={{
          title: "Edit Me",
          dueDate: "2025-08-16T00:00:00.000Z",
          completed: true,
        }}
        onSave={mockOnSave}
        trigger={<button>Edit Task</button>}
      />,
    );

    await userEvent.click(screen.getByText("Edit Task"));

    expect(screen.getByDisplayValue("Edit Me")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-08-16")).toBeInTheDocument();
  });
});
