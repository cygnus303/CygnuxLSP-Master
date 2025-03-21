var primary = localStorage.getItem("primary") || '#5c61f2';
var secondary = localStorage.getItem("secondary") || '#eeb82f';
var success = localStorage.getItem("success") || '#61ae41';
var info = localStorage.getItem("info") || '#4faad5';
var warning = localStorage.getItem("warning") || '#e6c830';
var danger = localStorage.getItem("danger") || '#f81f58';
window.TivoAdminConfig = {
	// Theme Primary Color
	primary: primary,
	// theme secondary color
	secondary: secondary,
	// theme success color
	success: success,
	// theme info color
	info: info,
	// theme warning color
	warning: warning,
	// theme danger color
	danger: danger,
};

function generateRandomString(lenth) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < lenth; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function generateRandomNumeric(lenth) {
	var text = "";
	var possible = "0123456789";

	for (var i = 0; i < lenth; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}