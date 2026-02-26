import healthData from '../../healthhearty.json';

export interface Post {
	id: string;
	title: string;
	excerpt: string;
	slug: string;
	html: string;
}

type RawPost = {
	post_title: string;
	post_excerpt: string;
	post_name: string;
	post_content: string;
};

const rawPosts = healthData as Record<string, RawPost>;

const allPosts: Post[] = Object.entries(rawPosts)
	.map(([id, value]) => ({
		id,
		title: value.post_title,
		excerpt: value.post_excerpt,
		slug: value.post_name,
		html: value.post_content
	}))
	// Keep posts in a stable order (by numeric id)
	.sort((a, b) => Number(a.id) - Number(b.id));

export function getAllPosts(): Post[] {
	return allPosts;
}

export function getPostBySlug(slug: string): Post | undefined {
	return allPosts.find((post) => post.slug === slug);
}

export function getPaginatedPosts(page: number, pageSize: number) {
	const totalItems = allPosts.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const currentPage = Math.min(Math.max(page, 1), totalPages);

	const start = (currentPage - 1) * pageSize;
	const end = start + pageSize;

	return {
		posts: allPosts.slice(start, end),
		currentPage,
		totalPages,
		totalItems
	};
}

