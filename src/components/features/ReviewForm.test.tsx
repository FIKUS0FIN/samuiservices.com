import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReviewForm } from './ReviewForm';
import * as reviewActions from '@/app/actions/reviews';

vi.mock('@/app/actions/reviews', () => ({
  submitReview: vi.fn(),
}));

describe('ReviewForm Component', () => {
  it('renders the form correctly', () => {
    render(<ReviewForm listingId="test-123" />);
    expect(screen.getByText('Leave a Review')).toBeInTheDocument();
    expect(screen.getByLabelText('Comment')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Review' })).toBeInTheDocument();
  });

  it('allows user to change rating', () => {
    render(<ReviewForm listingId="test-123" />);
    // Initial rating is 5
    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(5);

    // Click the 3rd star
    fireEvent.click(stars[2]);

    // Since we just check colors visually via style, let's verify styles.
    // The first 3 should be accent color, last 2 should be gray
    expect(stars[0]).toHaveStyle({ color: 'var(--accent-color)' });
    expect(stars[1]).toHaveStyle({ color: 'var(--accent-color)' });
    expect(stars[2]).toHaveStyle({ color: 'var(--accent-color)' });
    expect(stars[3]).toHaveStyle({ color: 'rgb(209, 213, 219)' }); // #d1d5db converted by jsdom
    expect(stars[4]).toHaveStyle({ color: 'rgb(209, 213, 219)' });
  });

  it('shows submitting state during form submission', async () => {
    vi.mocked(reviewActions.submitReview).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<ReviewForm listingId="test-123" />);

    const commentInput = screen.getByLabelText('Comment');
    fireEvent.change(commentInput, { target: { value: 'Great service!' } });

    const form = screen.getByRole('button', { name: 'Submit Review' }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submitting...' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
    });
  });

  it('displays success message on successful submission', async () => {
    vi.mocked(reviewActions.submitReview).mockResolvedValue({ success: true });

    render(<ReviewForm listingId="test-123" />);

    const commentInput = screen.getByLabelText('Comment');
    fireEvent.change(commentInput, { target: { value: 'Great service!' } });

    const form = screen.getByRole('button', { name: 'Submit Review' }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Thank you for submitting your review!')).toBeInTheDocument();
      expect(screen.queryByRole('form')).not.toBeInTheDocument();
    });
  });

  it('displays error message on submission failure', async () => {
    vi.mocked(reviewActions.submitReview).mockResolvedValue({ error: 'Already reviewed' });

    render(<ReviewForm listingId="test-123" />);

    const commentInput = screen.getByLabelText('Comment');
    fireEvent.change(commentInput, { target: { value: 'Great service!' } });

    const form = screen.getByRole('button', { name: 'Submit Review' }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Already reviewed')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit Review' })).not.toBeDisabled();
    });
  });
});
