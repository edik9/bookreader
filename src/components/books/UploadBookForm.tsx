import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { uploadBook } from "../../lib/api/bookService";
import type { Book } from "../../types/Book";

export function UploadBookForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Omit<Book, "id" | "createdAt" | "fileUrl" | "coverUrl">>({
    title: '',
    author: '',
    description: '',
    categories: []
  });

  const [files, setFiles] = useState<{ bookFile?: File; coverImage?: File }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !files.bookFile) return;
    setIsLoading(true);
    try {
      await uploadBook(formData, {
        bookFile: files.bookFile,
        coverImage: files.coverImage
      }, user.uid);
      alert('Книга успешно загружена!');
      setFormData({
        title: '',
        author: '',
        description: '',
        categories: []
      });
      setFiles({
        bookFile: undefined,
        coverImage: undefined
      });
    } catch (error) {
      console.error(error);
      alert('Ошибка при загрузке книги');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h2>Загрузить новую книгу</h2>
      
      <div className="form-group">
        <label>Название книги:</label>
        <input 
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Автор:</label>
        <input 
          type="text" 
          value={formData.author}
          onChange={(e) => setFormData({...formData, author: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Описание:</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Файл книги (PDF/EPUB):</label>
        <input
          type="file"
          accept=".pdf,.epub"
          onChange={(e) => setFiles({ ...files, bookFile: e.target.files?.[0] })}
          required
        />
      </div>

      <div className="form-group">
        <label>Обложка (опционально):</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFiles({ ...files, coverImage: e.target.files?.[0] })}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Загрузка...' : 'Загрузить книгу'}
      </button>
    </form>
  );
}