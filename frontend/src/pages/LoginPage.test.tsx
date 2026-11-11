import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoginPage } from "../pages/LoginPage";

describe("LoginPage", () => {
  it("renders login form with email and password fields", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it("has a link to registration page", () => {
    render(<LoginPage />);
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });
});