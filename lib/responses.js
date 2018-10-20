module.exports = {
	success: (data = {}) => JSON.stringify({
		success: true,
		data
	}),
	error: (error = "") => JSON.stringify({
		success: false,
		error
	})
}