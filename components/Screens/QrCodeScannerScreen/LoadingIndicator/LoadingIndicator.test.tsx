import React from 'react'
import { render } from '@testing-library/react-native'
import LoadingIndicator from './LoadingIndicator' // Adjust the import path as necessary

describe('LoadingIndicator', () => {
	it('renders an activity indicator and text', () => {
		const { getByTestId } = render(<LoadingIndicator />)

		const activityIndicator = getByTestId('activity-indicator')

		expect(activityIndicator).toBeTruthy()
	})
})
