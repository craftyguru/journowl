export interface Bookmark {
  id: string;
  userId: number;
  entryId: number;
  title: string;
  createdAt: Date;
  tags: string[];
}

class BookmarkStore {
  private bookmarks: Map<string, Bookmark> = new Map();
  private bookmarkId = 0;

  addBookmark(userId: number, entryId: number, title: string, tags: string[] = []): Bookmark {
    const id = `bookmark_${++this.bookmarkId}`;
    const bookmark: Bookmark = {
      id,
      userId,
      entryId,
      title,
      tags,
      createdAt: new Date()
    };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  getBookmarks(userId: number): Bookmark[] {
    return Array.from(this.bookmarks.values()).filter(b => b.userId === userId);
  }

  removeBookmark(id: string): boolean {
    return this.bookmarks.delete(id);
  }

  isBookmarked(userId: number, entryId: number): boolean {
    return Array.from(this.bookmarks.values()).some(b => b.userId === userId && b.entryId === entryId);
  }
}

const bookmarkStore = new BookmarkStore();

export class BookmarkService {
  static addBookmark(userId: number, entryId: number, title: string, tags: string[] = []): Bookmark {
    return bookmarkStore.addBookmark(userId, entryId, title, tags);
  }

  static getBookmarks(userId: number): Bookmark[] {
    return bookmarkStore.getBookmarks(userId);
  }

  static removeBookmark(id: string): boolean {
    return bookmarkStore.removeBookmark(id);
  }

  static isBookmarked(userId: number, entryId: number): boolean {
    return bookmarkStore.isBookmarked(userId, entryId);
  }
}
