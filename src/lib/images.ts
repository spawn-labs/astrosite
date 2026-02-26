type UnsplashImage = {
	src: string;
	alt: string;
	photographerName: string;
	photographerUrl: string;
	unsplashUrl: string;
};

const UTM = 'utm_source=Health%20Hearty&utm_medium=referral';

const FALLBACK_IMAGE: UnsplashImage = {
	src: 'https://source.unsplash.com/960x540/?health,wellness,medical',
	alt: 'health and wellness',
	photographerName: 'Unsplash contributors',
	photographerUrl: `https://unsplash.com/?${UTM}`,
	unsplashUrl: `https://unsplash.com/?${UTM}`
};

const imageCache = new Map<string, Promise<UnsplashImage>>();

export function getUnsplashImageForSlug(slug: string): Promise<UnsplashImage> {
	if (imageCache.has(slug)) {
		return imageCache.get(slug)!;
	}

	const promise = (async () => {
		const accessKey = import.meta.env.UNSPLASH_ACCESS_KEY;
		if (!accessKey) {
			return FALLBACK_IMAGE;
		}

		const query = slug.replace(/-/g, ' ');
		const url = new URL('https://api.unsplash.com/photos/random');
		url.searchParams.set('query', query || 'health');
		url.searchParams.set('orientation', 'landscape');
		url.searchParams.set('content_filter', 'high');
		url.searchParams.set('client_id', accessKey);

		try {
			const res = await fetch(url.toString());
			if (!res.ok) {
				return FALLBACK_IMAGE;
			}
			const data: any = await res.json();

			const raw = data?.urls?.regular || data?.urls?.full;
			if (!raw) {
				return FALLBACK_IMAGE;
			}

			const src = `${raw}&auto=format&fit=crop&w=960&h=540&q=80`;
			const photographerName: string = data?.user?.name || 'Unsplash photographer';
			const username: string | undefined = data?.user?.username;

			const photographerUrl =
				username != null
					? `https://unsplash.com/@${username}?${UTM}`
					: `https://unsplash.com/?${UTM}`;

			return {
				src,
				alt: query,
				photographerName,
				photographerUrl,
				unsplashUrl: `https://unsplash.com/?${UTM}`
			};
		} catch {
			return FALLBACK_IMAGE;
		}
	})();

	imageCache.set(slug, promise);
	return promise;
}

