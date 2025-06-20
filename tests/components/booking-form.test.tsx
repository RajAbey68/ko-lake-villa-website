import { render, screen, fireEvent, waitFor } from "../components/ui/test-utils"
import BookingPage from "../../app/booking/page"

describe("BookingForm Component", () => {
  test("renders booking form elements", () => {
    render(<BookingPage />)

    expect(screen.getByLabelText(/room type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/check-in date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/check-out date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument()
  })

  test("calculates total price correctly", async () => {
    render(<BookingPage />)

    // Select room and dates
    fireEvent.change(screen.getByLabelText(/room type/i), { target: { value: "KLV1" } })
    fireEvent.change(screen.getByLabelText(/check-in/i), { target: { value: "2024-02-01" } })
    fireEvent.change(screen.getByLabelText(/check-out/i), { target: { value: "2024-02-04" } })

    // Wait for calculation
    await waitFor(() => {
      expect(screen.getByText(/\$321/)).toBeInTheDocument() // 107 * 3 nights
    })
  })

  test("validates required fields", async () => {
    render(<BookingPage />)

    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole("button", { name: /submit booking inquiry/i }))

    // Check for validation (HTML5 validation will prevent submission)
    const nameInput = screen.getByLabelText(/full name/i)
    expect(nameInput).toBeInvalid()
  })
})
