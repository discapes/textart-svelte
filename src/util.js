import { ENDESGA, PASTEL } from "./palettes";

export function dialog(text, duration) {
	let div = document.createElement("div");
	div.innerText = text;
	div.classList.add("dialog");
	div.style.animation = `fade-out ${duration}s`;
	document.body.appendChild(div);
	setTimeout(() => div.remove(), duration * 1000);
}

export const letterToPixel = {
	0: (cc) => [
		(cc % 2 === 1 && 255) + cc / 2,
		cc % 3 === 2 && 255,
		(cc % 5 === 4 && 255) + cc,
		255,
	],
	1: (cc) => [
		(cc % 2 === 1 && 200) + cc * 2 - 100,
		(cc % 5 === 4 && 200) + cc * 2 - 100,
		(cc % 3 === 2 && 200) + cc * 2 - 100,
		255,
	],
	2: (cc) =>
		hexToRGBA(PASTEL[ccToPaletteIndex(cc)]),
	3: (cc) =>
		hexToRGBA(ENDESGA[ccToPaletteIndex(cc, 1)]),
}
for (let i = 0; i < (64); i++) {
	letterToPixel[i + 4] = (cc) =>
		[...hsvToRgb(((ccToPaletteIndex(cc, 2) + i) % 64) / 63, 1, 1), 255]
}
letterToPixel.max = Object.keys(letterToPixel).length - 1

export function hexToRGBA(hex) {
	const r = parseInt(hex.slice(1, 1 + 2), 16)
	const g = parseInt(hex.slice(3, 3 + 2), 16)
	const b = parseInt(hex.slice(5, 5 + 2), 16)
	return [r, g, b, 255];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * param   Number  h       The hue
 * param   Number  s       The saturation
 * param   Number  v       The value
 * return  Array           The RGB representation
 */
export function hsvToRgb(h, s, v) {
	let r, g, b;

	const i = Math.floor(h * 6);
	const f = h * 6 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function ccToPaletteIndex(cc, alternative) {
	if (alternative === 1) {
		if (cc == 32) // space
			return 1;
		if (cc == 46) // dot
			return 0;
		if (cc >= 48 && cc < 58) // 0-9
			return cc - 48 + 2;
		if (cc >= 65 && cc < 91)
			return cc - 65 + 2 + 10 // A-Z
		if (cc >= 97 && cc < 123)
			return cc - 97 + 2 + 10 + 26 // a-z
		return cc % 64
	} else if (alternative === 2) {
		if (cc >= 65 && cc < 91)
			return cc - 65 // A-Z
		if (cc >= 48 && cc < 58) // 0-9
			return cc - 48 + 26;
		if (cc >= 97 && cc < 123)
			return cc - 97 + 26 + 10 // a-z
		if (cc == 32) // space
			return 62;
		if (cc == 46) // dot
			return 63;
		return cc % 64
	}
	else {
		if (cc >= 48 && cc < 58) // 0-9
			return cc - 48;
		if (cc >= 65 && cc < 91)
			return cc - 65 + 10 // A-Z
		if (cc >= 97 && cc < 123)
			return cc - 97 + 10 + 26 // a-z
		if (cc == 32) // space
			return 62;
		if (cc == 46) // dot
			return 63;
		return cc % 64
	}
}