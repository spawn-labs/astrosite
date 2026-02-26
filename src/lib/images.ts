type UnsplashPhoto = {
	id: string;
	photographerName: string;
	photographerUsername: string;
};

const UTM = 'utm_source=Health%20Hearty&utm_medium=referral';

const FALLBACK_PHOTOS: UnsplashPhoto[] = [
	{
		id: 'nhG5gix93es',
		photographerName: 'Hal Gatewood',
		photographerUsername: 'halacious'
	},
	{
		id: 'wbw5RjQXxyg',
		photographerName: 'Mika Baumeister',
		photographerUsername: 'kommumikation'
	},
	{
		id: 'ykX3Wb8y4XI',
		photographerName: 'little plant',
		photographerUsername: 'little_plant'
	}
];

function hashString(input: string) {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
	}
	return hash;
}

export function getUnsplashImageForSlug(slug: string) {
	const photo = FALLBACK_PHOTOS[hashString(slug) % FALLBACK_PHOTOS.length];

	// Source API: stable by photo ID (no keyword ambiguity).
	const src = `https://source.unsplash.com/${photo.id}/960x540`;
	const photoUrl = `https://unsplash.com/photos/${photo.id}?${UTM}`;
	const photographerUrl = `https://unsplash.com/@${photo.photographerUsername}?${UTM}`;

	return {
		src,
		alt: slug.replace(/-/g, ' '),
		photoUrl,
		photographerName: photo.photographerName,
		photographerUrl,
		unsplashUrl: `https://unsplash.com/?${UTM}`
	};
}

