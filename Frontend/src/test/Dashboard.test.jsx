import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import axios from "@/lib/axios";

vi.mock("@/lib/axios");

vi.mock("@/components/task/TaskFormModal", () => ({
  default: ({ onSave, trigger }) => (
    <div>
      {trigger}
      <div data-testid="mock-modal">Modal content here</div>
      <button onClick={() => onSave({ title: "Test Task" })}>Submit</button>
    </div>
  ),
}));

describe("Dashboard Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockTasks = [
    {
      _id: "1",
      title: "Task One",
      completed: false,
      dueDate: "2025-08-06T00:00:00.000Z",
      user: "user1",
    },
    {
      _id: "2",
      title: "Task Two",
      completed: true,
      dueDate: null,
      user: "user1",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockTasks });
    axios.post.mockResolvedValue({ data: { ...mockTasks[0], _id: "3" } });
  });

  it("renders loading state initially", async () => {
    axios.get.mockResolvedValueOnce({ data: mockTasks });

    render(<Dashboard />, { wrapper: MemoryRouter });

    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();

    await screen.findByText("Task One");
  });

  it("renders tasks after successful fetch", async () => {
    axios.get.mockResolvedValueOnce({ data: mockTasks });

    render(<Dashboard />, { wrapper: MemoryRouter });

    expect(await screen.findByText("Task One")).toBeInTheDocument();
    expect(screen.getByText("Task Two")).toBeInTheDocument();
    expect(screen.getAllByText(/Completed|Pending/)).toHaveLength(2);
  });

  it("renders error message on API failure", async () => {
    axios.get.mockRejectedValueOnce(new Error("API Error"));

    render(<Dashboard />, { wrapper: MemoryRouter });

    expect(await screen.findByText("Failed to load tasks")).toBeInTheDocument();
  });

  it("shows 'No tasks found' when API returns empty list", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<Dashboard />, { wrapper: MemoryRouter });

    expect(await screen.findByText("No tasks found.")).toBeInTheDocument();
  });

  it("searches tasks when input is typed", async () => {
    axios.get.mockResolvedValueOnce({ data: mockTasks });

    render(<Dashboard />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.queryByText("Loading tasks...")).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Search tasks...");
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "project" } });

    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("search=project"),
      ),
    );
  });

  it("deletes a task when delete is confirmed", async () => {
    axios.get.mockResolvedValueOnce({ data: mockTasks });
    axios.delete.mockResolvedValueOnce({});

    window.confirm = vi.fn(() => true);

    render(<Dashboard />, { wrapper: MemoryRouter });
    await screen.findByText("Task One");

    const deleteBtn = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("api/tasks/1");
    });
  });
});
