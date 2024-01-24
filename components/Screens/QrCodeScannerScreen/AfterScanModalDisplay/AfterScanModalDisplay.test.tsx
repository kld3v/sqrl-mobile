import React from 'react'
import { render, screen } from '@testing-library/react-native'
import AfterScanModalDisplay from './AfterScanModalDisplay'

describe('AfterScanModalDisplay', () => {
	it('displays the trust score when received as a prop', () => {
		const trustScore = '5'
		render(
			<AfterScanModalDisplay
				showModal={true}
				setShowModal={() => {}}
				trust_score={trustScore}
				url=''
				setScanned={() => {}}
				setUrl={() => {}}
			/>
		)
		const trustScoreElement = screen.getByText(`Trust Score: ${trustScore}`)
		expect(trustScoreElement).toBeTruthy()
	})
})
