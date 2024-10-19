import { vi } from 'vitest';
import * as auth from '../../../api/auth';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import UserMessage from '../../../components/UserMessage/UserMessage';

const loginMock = vi.spyOn(auth, 'login');
const refreshAccessTokenMock = vi.spyOn(auth, 'refreshAccessToken');

describe('UserMessage tests', () => {
    it('should render the user message container', () => {
        render(<UserMessage message="Hello, World!" />);
        const userMessageContainer = screen.getByText('Hello, World!');
        expect(userMessageContainer).toBeInTheDocument();
    });
});
