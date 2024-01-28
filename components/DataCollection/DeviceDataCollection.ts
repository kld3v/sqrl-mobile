import * as Device from 'expo-device'

export default class DeviceDataCollection {
	static async collectAllData() {
		const deviceName = Device.deviceName
		const designName = Device.designName
		const osName = Device.osName
		const osVersion = Device.osVersion
		const modelId = Device.modelId
		const modelName = Device.modelName
		const brand = Device.brand
		const manufacturer = Device.manufacturer
		const totalMemory = Device.totalMemory
		const supportedCpuArchitectures = Device.supportedCpuArchitectures
		const osBuildId = Device.osBuildId
		const osBuildFingerprint = Device.osBuildFingerprint
		const osInternalBuildId = Device.osInternalBuildId
		const deviceYearClass = Device.deviceYearClass
		const platformApiLevel = Device.platformApiLevel
		const productName = Device.productName
		const isDevice = Device.isDevice
		const deviceType = Device.deviceType
		const platformFeatures = Device.getPlatformFeaturesAsync()
		const upTime = Device.getUptimeAsync()
		const isRooted = Device.isRootedExperimentalAsync()
		const isSideLoadingEnabled = Device.isSideLoadingEnabledAsync()

		const device = {
			deviceName,
			osName,
			osVersion,
			modelId,
			modelName,
			brand,
			manufacturer,
			totalMemory,
			supportedCpuArchitectures,
			osBuildId,
			osInternalBuildId,
			deviceYearClass,
			platformApiLevel,
			isDevice,
			deviceType,
			platformFeatures,
			upTime,
			isRooted,
			isSideLoadingEnabled,
			designName,
			productName,
			osBuildFingerprint,
		}
		return device
	}
}
