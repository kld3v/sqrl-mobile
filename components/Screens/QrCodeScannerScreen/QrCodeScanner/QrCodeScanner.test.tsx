import react from 'react'
import QrCodeScanner from './QrCodeScanner'
import { fireEvent, render } from '@testing-library/react-native'
import { Button } from 'react-native'
import { BarCodeScannedCallback } from 'expo-barcode-scanner'
// Mock the expo-barcode-scanner module
jest.mock('expo-barcode-scanner', () => {
	return {
		BarCodeScanner: jest.fn().mockImplementation(({ onBarCodeScanned, testID }) => {
			const fakeScan = () => {
				onBarCodeScanned({ type: 'mockType', data: 'mockData' })
			}
			// Simulate a delay for scanning like in a real scenario
			setTimeout(fakeScan, 100)

			return null
		}),
	}
})
describe('QrCodeScanner functionality', () => {
	// TODO
	// it('Renders the qr code scanner', () => {
	// 	const { getByTestId } = render(
	// 		<QrCodeScanner
	// 			scanned={false}
	// 			onScan={jest.fn()}
	// 		/>
	// 	)
	// 	expect(getByTestId('barcode-scanner')).toBeTruthy()
	// })

	it('Calls onScan when a barcode is scanned', () => {
		jest.useFakeTimers()
		const onScanMock = jest.fn()
		render(
			<QrCodeScanner
				scanned={false}
				onScan={onScanMock}
			/>
		)

		// Fast-forward until all timers have been executed
		jest.runAllTimers()

		// Now our onScanMock should have been called
		expect(onScanMock).toHaveBeenCalledWith({ type: 'mockType', data: 'mockData' })

		// Clean up timers
		jest.useRealTimers()
	})
})
