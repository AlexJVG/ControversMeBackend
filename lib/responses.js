module.exports = {
	success: (data = {}) => JSON.stringify({
		success: true,
		data
	}),
	error: (error = 404) => JSON.stringify({
		success: false,
		error
	})
}