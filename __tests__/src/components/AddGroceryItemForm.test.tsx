import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddGroceryItemForm } from "../../../src/components/AddGroceryItemForm";
import "@testing-library/jest-dom";

describe("AddGroceryItemForm", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with all required fields", () => {
    render(
      <AddGroceryItemForm onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    // Check for form title
    expect(screen.getByText("Add New Grocery Item")).toBeInTheDocument();

    // Check for required fields
    expect(screen.getByLabelText(/Item Name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unit \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category \*/i)).toBeInTheDocument();

    // Check for optional fields
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Item/i })
    ).toBeInTheDocument();
  });

  it("validates required fields on submit", async () => {
    render(
      <AddGroceryItemForm onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    // Try to submit empty form
    fireEvent.click(screen.getByRole("button", { name: /Add Item/i }));

    // Check for error message
    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("successfully submits form with valid data", async () => {
    render(
      <AddGroceryItemForm onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Item Name \*/i), {
      target: { value: "Apples" },
    });
    fireEvent.change(screen.getByLabelText(/Quantity \*/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: "3.99" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /Add Item/i }));

    // Check if success message appears
    expect(
      await screen.findByText("Item added successfully!")
    ).toBeInTheDocument();

    // Verify onSubmit was called with correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Apples",
      quantity: 2,
      unit: "pieces",
      category: "produce",
      price: "3.99",
      notes: "",
    });
  });

  it("validates price format", async () => {
    render(
      <AddGroceryItemForm onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    // Fill out form with invalid price
    fireEvent.change(screen.getByLabelText(/Item Name \*/i), {
      target: { value: "Apples" },
    });
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: "invalid" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /Add Item/i }));

    // Check for error message
    expect(await screen.findByText("Invalid price format")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("closes form when cancel button is clicked", () => {
    render(
      <AddGroceryItemForm onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("enforces character limits", async () => {
    render(
      <AddGroceryItemForm onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    // Test name field limit (50 characters)
    const longName = "a".repeat(51);
    fireEvent.change(screen.getByLabelText(/Item Name \*/i), {
      target: { value: longName },
    });

    // Test notes field limit (200 characters)
    const longNotes = "a".repeat(201);
    fireEvent.change(screen.getByLabelText(/Notes/i), {
      target: { value: longNotes },
    });

    fireEvent.click(screen.getByRole("button", { name: /Add Item/i }));

    expect(
      await screen.findByText("Name must be less than 50 characters")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Notes must be less than 200 characters")
    ).toBeInTheDocument();
  });
});
