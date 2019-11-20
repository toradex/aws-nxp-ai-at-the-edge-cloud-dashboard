import { Notify } from 'quasar'

export default (message, timeout = 1000, color='negative', textColor='white', position = 'top-right', icon='report_problem') => {
	Notify.create({
		color,
		icon,
		textColor,
		message,
		position,
		timeout
	})
}
