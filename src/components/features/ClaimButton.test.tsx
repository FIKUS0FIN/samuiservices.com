import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ClaimButton } from './ClaimButton';
import * as claimActions from '@/app/actions/claim';

// Mock the server action
vi.mock('@/app/actions/claim', () => ({
  submitClaimRequest: vi.fn(),
}));

describe('ClaimButton', () => {
  it('renders the claim button and description', () => {
    render(<ClaimButton listingId="test-123" />);
    expect(screen.getByText('Are you the owner of this business?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Claim Business' })).toBeInTheDocument();
  });

  it('shows submitting state when clicked', async () => {
    // Mock the action to never resolve so we can see the loading state
    vi.mocked(claimActions.submitClaimRequest).mockImplementation(() => new Promise(() => {}));
    
    render(<ClaimButton listingId="test-123" />);
    const button = screen.getByRole('button', { name: 'Claim Business' });
    
    fireEvent.submit(screen.getByRole('button', { name: 'Claim Business' }).closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submitting...' })).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  it('shows success message on successful claim', async () => {
    vi.mocked(claimActions.submitClaimRequest).mockResolvedValue({ success: true });
    
    render(<ClaimButton listingId="test-123" />);
    
    fireEvent.submit(screen.getByRole('button', { name: 'Claim Business' }).closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByText(/Request Submitted!/)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Claim Business' })).not.toBeInTheDocument();
    });
  });

  it('shows error message on failure', async () => {
    vi.mocked(claimActions.submitClaimRequest).mockResolvedValue({ error: 'Failed to claim' });
    
    render(<ClaimButton listingId="test-123" />);
    
    fireEvent.submit(screen.getByRole('button', { name: 'Claim Business' }).closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to claim')).toBeInTheDocument();
      // Button should reset
      expect(screen.getByRole('button', { name: 'Claim Business' })).not.toBeDisabled();
    });
  });
});
