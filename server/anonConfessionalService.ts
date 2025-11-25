export interface AnonPost {
  id: string;
  anonymousId: string;
  content: string;
  mood: string;
  createdAt: Date;
  likes: number;
  responses: number;
  category: string;
}

class AnonStore {
  private posts: Map<string, AnonPost> = new Map();
  private postId = 0;
  private anonCounter = 0;

  createPost(content: string, mood: string, category: string): AnonPost {
    const id = `anon_${++this.postId}`;
    const anonymousId = `Anonymous${++this.anonCounter}`;
    
    const post: AnonPost = {
      id,
      anonymousId,
      content,
      mood,
      createdAt: new Date(),
      likes: 0,
      responses: 0,
      category
    };
    this.posts.set(id, post);
    return post;
  }

  getAllPosts(): AnonPost[] {
    return Array.from(this.posts.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getPostsByCategory(category: string): AnonPost[] {
    return Array.from(this.posts.values()).filter(p => p.category === category);
  }

  likePost(postId: string): AnonPost | null {
    const post = this.posts.get(postId);
    if (post) {
      post.likes++;
      return post;
    }
    return null;
  }
}

const anonStore = new AnonStore();

export class AnonConfessionalService {
  static createPost(content: string, mood: string, category: string): AnonPost {
    return anonStore.createPost(content, mood, category);
  }

  static getAllPosts(): AnonPost[] {
    return anonStore.getAllPosts();
  }

  static getPostsByCategory(category: string): AnonPost[] {
    return anonStore.getPostsByCategory(category);
  }

  static likePost(postId: string): AnonPost | null {
    return anonStore.likePost(postId);
  }
}
