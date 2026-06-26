import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FavoriteToggle } from './FavoriteToggle';
import * as favoriteActions from '@/app/actions/favorites';

vi.mock('@/app/actions/favorites', () => ({
  toggleFavorite: vi.fn(),
}));

describe('FavoriteToggle Component', () => {
  it('renders initial state correctly (unfavorited)', () => {
    render(<FavoriteToggle listingId="test-123" initialIsFavorited={false} />);
    const button = screen.getByRole('button', { name: 'Add to favorites' });
    expect(button).toBeInTheDocument();

    const svg = button.querySelector('svg')!;
    expect(svg).toHaveAttribute('fill', 'none');
  });

  it('renders initial state correctly (favorited)', () => {
    render(<FavoriteToggle listingId="test-123" initialIsFavorited={true} />);
    const button = screen.getByRole('button', { name: 'Remove from favorites' });
    expect(button).toBeInTheDocument();

    const svg = button.querySelector('svg')!;
    expect(svg).toHaveAttribute('fill', 'var(--accent-color)');
  });

  it('optimistically updates UI when clicked and handles success', async () => {
    vi.mocked(favoriteActions.toggleFavorite).mockResolvedValue({ isFavorited: true });

    render(<FavoriteToggle listingId="test-123" initialIsFavorited={false} />);
    const button = screen.getByRole('button', { name: 'Add to favorites' });

    fireEvent.click(button);

    // Optimistic update
    expect(button.querySelector('svg')).toHaveAttribute('fill', 'var(--accent-color)');

    await waitFor(() => {
      expect(favoriteActions.toggleFavorite).toHaveBeenCalledWith('test-123');
      // Should remain favorited
      expect(button.querySelector('svg')).toHaveAttribute('fill', 'var(--accent-color)');
    });
  });

  it('reverts UI when action fails', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(favoriteActions.toggleFavorite).mockResolvedValue({ error: 'Failed to toggle' });

    render(<FavoriteToggle listingId="test-123" initialIsFavorited={false} />);
    const button = screen.getByRole('button', { name: 'Add to favorites' });

    fireEvent.click(button);

    // Optimistic update
    expect(button.querySelector('svg')).toHaveAttribute('fill', 'var(--accent-color)');

    await waitFor(() => {
      expect(favoriteActions.toggleFavorite).toHaveBeenCalledWith('test-123');
      // Revert UI on error
      expect(button.querySelector('svg')).toHaveAttribute('fill', 'none');
      expect(alertSpy).toHaveBeenCalledWith('Failed to toggle');
    });

    alertSpy.mockRestore();
  });
});
