# СТРУКТУРА БАЗЫ ДАННЫХ FIREBASE

## Документ пользователя `/users/{userId}`

Каждый пользователь представлен документом с ID, совпадающим с его UID в Firebase Authentication.

### Поля документа пользователя

`email` (string, optional) — email пользователя (при регистрации).
`displayName` (string, optional) — имя пользователя.
`createdAt` (timestamp) — дата создания аккаунта (или первой синхронизации).
`lastActiveAt` (timestamp) — время последней активности (входа или синхронизации).
`accountType` (string) — тип аккаунта:

- `"guest"` — гостевой пользователь без регистрации.
- `"registered"` — зарегистрированный пользователь.
- `"migrated"` — гость, данные которого мигрированы в зарегистрированный аккаунт.
  `deviceId` (string, optional) — ID устройства, используется для гостевых пользователей (генерируется локально).
  `isGuest` (boolean) — флаг гостевого режима (сохраняется для совместимости и удобства).

**devices (collection)**
Хранит информацию о устройствах пользователя для синхронизации.
Документ `{deviceId}`:

- `lastSync` (timestamp) — последнее время синхронизации.
- `deviceInfo` (map) — информация об устройстве:
  - `model` (string)
  - `os` (string)
  - `appVersion` (string)
  - `timezone` (string)
- `pendingOperations` (array[map]) — необработанные операции для синхронизации (опционально)
- `operationType` (string) — тип операции, например, "updateProgress", "addBookmark", "deleteAnnotation" и т.п.
- `bookId` (string) — уникальный идентификатор книги, к которой относится операция.
- `percent` (number, optional) — числовое значение, например, процент прочитанной книги (от 0 до 100). Может отсутствовать, если не применимо к операции.
- `timestamp` (string) — временная метка операции в формате ISO 8601, например, "2024-06-10T14:50:00Z". В Firestore это поле обычно хранится как тип Timestamp.

**migration` (map, optional)**
Данные миграции гостевого аккаунта:

- `sourceDeviceId` (string) — устройство, с которого выполнена миграция.
- `migratedAt` (timestamp) — дата миграции.
- `importedCollections` (boolean) — импортированы коллекции.
- `importedBooks` (boolean) — импортированы книги.

**preferences (map)**  
Настройки пользователя, сгруппированные по категориям.
**ui (map)** — настройки интерфейса пользователя.  
 - `theme` (string) — тема приложения, например: `"light"`, `"dark"` или `"system"`.  
 - `fontSize` (number) — размер шрифта в пикселях.  
 - `language` (string) — язык интерфейса в формате ISO (например, `"ru"`, `"en"`).  
 - `showPageNumbers` (boolean) — отображать номера страниц.

**reading (map)** — настройки чтения.  
 - `scrollMode` (string) — режим прокрутки, например: `"paged"` (постранично) или `"scroll"` (прокрутка).  
 - `defaultFont` (string) — шрифт для отображения текста.  
 - `lineSpacing` (number) — межстрочный интервал (например, 1.5).  
 - `nightMode` (boolean) — включён ли ночной режим для чтения.

**notifications (map)** — настройки уведомлений.  
 - `remindersEnabled` (boolean) — включены ли напоминания о чтении.  
 - `dailyGoalMinutes` (number) — цель по времени чтения в минутах в день.

**stats (map)**  
Статистика активности пользователя, разбитая по блокам.

**reading (map)** — статистика чтения.  
 - `totalBooksRead` (number) — общее количество прочитанных книг.  
 - `totalReadingTimeMinutes` (number) — общее время чтения в минутах.  
 - `averageReadingSessionMinutes` (number) — средняя длительность одной сессии чтения.  
 - `currentStreakDays` (number) — текущая серия дней с активным чтением.  
 - `longestStreakDays` (number) — максимальная серия дней с активным чтением.

**library (map)** — статистика библиотеки.  
 - `totalBooksAdded` (number) — количество добавленных книг.  
 - `favoriteBooksCount` (number) — количество книг, помеченных как избранные.  
 - `abandonedBooksCount` (number) — количество заброшенных книг.

**lastActivity (map)** — данные о последней активности.  
 - `lastLoginAt` (timestamp) — дата и время последнего входа пользователя.  
 - `lastReadAt` (timestamp) — дата и время последнего чтения.

---

### Подколлекции пользователя

#### 1. `collections` (collection)

Коллекции книг, созданные пользователем.

Документ `{collectionId}`:

- `name` (string) — название коллекции.
- `coverUrl` (string) — ссылка на обложку коллекции в Firebase Storage.
- `createdAt` (timestamp) — дата создания коллекции.
- `isPublic` (boolean) — доступность коллекции для других пользователей.

#### 2. `tags` (collection)

Теги, которые пользователь создал для маркировки книг.

Документ `{tagId}`:

- `name` (string) — название тега.
- `createdAt` (timestamp) — дата создания тега.

#### 3. `library` (collection)

Библиотека пользователя — книги, которые он добавил.

Документ `{bookId}`:

Основные поля:
  - `title` (string) — название книги.
  - `author` (string) — автор книги.
  - `fileStoragePath` (string) — путь к файлу книги в Firebase Storage, например: `"users/{userId}/books/{bookId}/book.epub"`.
  - `fileFormat` (string) — формат файла, например: `"epub"`, `"pdf"`.
  - `fileSizeMB` (number) — размер файла в мегабайтах.
  - `metadata` (map) — метаданные книги:
    - `language` (string) — язык книги.
    - `genres` (array[string]) — жанры книги.
    - `publisher` (string) — издатель.
    - `localizedTitles` (map<string, string>) — локализованные названия книги, где ключ — язык, значение — название.
  - `status` (map) — статус книги:
    - `isFavorite` (boolean) — избранная книга.
    - `isRead` (boolean) — прочитана.
    - `isAbandoned` (boolean) — заброшена.
  - `progress` (map) — прогресс чтения:
    - `percent` (number) — процент прочитанного.
    - `currentChapter` (string) — текущая глава.
    - `lastPosition` (map) — позиции по устройствам:
      - `{deviceId}` (map):
        - `percent` (number) — процент прочитанного на устройстве.
        - `updatedAt` (timestamp) — время обновления позиции.
        - `deviceType` (string) — тип устройства.
    - `daysSpent` (number) — количество дней, потраченных на чтение.
  - `stats` (map) — статистика чтения:
    - `lastRead` (timestamp) — дата последнего чтения.
    - `totalReadingTimeMinutes` (number) — общее время чтения в минутах.
  - `rating` (number) — рейтинг книги (например, от 1 до 5).
  - `coverStoragePath` (string) — путь к обложке книги в Storage, например: `"users/{userId}/books/{bookId}/cover.jpg"`.

##### Подколлекции книги

- `chapters` (collection):
  Документ `{chapterId}`:
  - `title` (string) — название главы.
  - `position` (number) — порядковый номер главы.
  - `contentSummary` (string) — краткое содержание главы.
- `pages` (collection):
  Документ `{pageNumber}`:
  - `chapterId` (string) — ID главы, к которой относится страница.
  - `contentHash` (string) — хэш содержимого страницы (для контроля изменений).
  - `textExtract` (string) — извлечённый текст страницы.
  - `pageStoragePath` (string) — путь к файлу страницы в Storage, например: `"users/{userId}/books/{bookId}/pages/{pageNumber}.txt"`.
- `readingSessions` (collection):
  Документ `{sessionId}`:
  - `date` (string, формат "YYYY-MM-DD") — дата сессии чтения.
  - `durationMinutes` (number) — продолжительность сессии в минутах.
  - `pagesRead` (number) — количество прочитанных страниц за сессию.

#### 4. `annotations` (collection)
Аннотации пользователя к книгам.
Документ `{annotationId}`:
- `bookId` (string) — ID книги, к которой относится аннотация.
- `type` (string) — тип аннотации: `"highlight"`, `"note"`, `"bookmark"`.
- `content` (map):
  - `text` (string) — текст аннотации.
  - `page` (number) — номер страницы.
  - `chapterId` (string) — ID главы.
- `color` (map):
  - `hex` (string) — цвет в HEX формате.
  - `name` (string) — название цвета.
- `createdAt` (timestamp) — дата создания.
- `updatedAt` (timestamp) — дата обновления.
- `updatedByDevice` (string) — устройство, с которого обновлялась аннотация.
- `visibility` (string) — видимость: `"private"`, `"shared"`, `"public"`.
- `version` (number) — версия аннотации.

##### Подколлекция аннотации

- `history` (collection):
  Документ `{historyId}`:
  - `updatedAt` (timestamp) — дата обновления.
  - `updatedByDevice` (string) — устройство, с которого внесено изменение.
  - `contentDiff` (map) — изменения в содержимом (например, дельты текста).
    - `text` (string) - добавление комментария

#### 5. `collectionBooks` (collection)
Связь между коллекциями и книгами — позволяет определить, какие книги входят в какую коллекцию.
Документ `{docId}`:
- `collectionId` (string) — ID коллекции.
- `bookId` (string) — ID книги.

#### 6. `tagBooks` (collection)
Связь между тегами и книгами — позволяет маркировать книги тегами.
Документ `{docId}`:
- `tagId` (string) — ID тега.
- `bookId` (string) — ID книги.

#### 7. `searchIndex` (collection)
Индекс для поиска по книгам пользователя.
Документ `{searchId}`:
- `bookId` (string) — ID книги.
- `text` (string) — индексируемый текст.
- `tags` (array[string]) — теги книги.
- `genres` (array[string]) — жанры книги.
- `updatedAt` (timestamp) — дата обновления индекса.

#### СТРУКТУРА ПАПОК И ФАЙЛОВ ПРОЕКТА
/src
│
├── /app
│   ├── AppRouter.tsx
│   ├── MainLayout.tsx
│   └── MainLayout.module.css 
│
├── /core
│   ├── /models
│   │   ├── user.model.ts
│   │   ├── book.model.ts
│   │   ├── collection.model.ts
│   │   ├── annotation.model.ts
│   │   └── sync.model.ts
│   │
│   └── /services
│       ├── firestore.service.ts
│       ├── auth.service.ts
│       └── data.service.ts
│
├── /features
│   ├── /auth
│   │   ├── /components
│   │   │   ├── /AuthForm
│   │   │   │   ├── AuthForm.tsx
│   │   │   │   ├── AuthForm.module.css
│   │   │   │   ├── AuthForm.test.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── /GuestWarning
│   │   │       ├── GuestWarning.tsx
│   │   │       ├── GuestWarning.module.css
│   │   │       └── index.ts
│   │   │
│   │   ├── LoginPage.tsx
│   │   ├── LoginPage.module.css
│   │   ├── RegisterPage.tsx
│   │   ├── RegisterPage.module.css
│   │   └── /hooks
│   │       └── useAuth.ts
│   │
│   ├── /library
│   │   ├── /components
│   │   │   ├── /BookCard
│   │   │   │   ├── BookCard.tsx
│   │   │   │   ├── BookCard.module.css
│   │   │   │   ├── BookCard.test.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── /BookList
│   │   │   │   ├── BookList.tsx
│   │   │   │   ├── BookList.module.css
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── /UploadBookForm
│   │   │       ├── UploadBookForm.tsx
│   │   │       ├── UploadBookForm.module.css
│   │   │       └── index.ts
│   │   │
│   │   ├── LibraryPage.tsx
│   │   ├── LibraryPage.module.css
│   │   └── /hooks
│   │       └── useBooks.ts
│   │
│   ├── /reader
│   │   ├── /components
│   │   │   ├── /BookReader
│   │   │   │   ├── BookReader.tsx
│   │   │   │   ├── BookReader.module.css
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── /ChapterNav
│   │   │   │   ├── ChapterNav.tsx
│   │   │   │   ├── ChapterNav.module.css
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── /ProgressTracker
│   │   │       ├── ProgressTracker.tsx
│   │   │       ├── ProgressTracker.module.css
│   │   │       └── index.ts
│   │   │
│   │   └── ReaderPage.tsx
│   │
│   ├── /collections
│   │   ├── CollectionsPage.tsx
│   │   ├── CollectionsPage.module.css
│   │   └── /components
│   │       └── /CollectionEdit
│   │           ├── CollectionEdit.tsx
│   │           ├── CollectionEdit.module.css
│   │           └── index.ts
│   │
│   └── /annotations
│       ├── /components
│       │   ├── /AnnotationPanel
│       │   │   ├── AnnotationPanel.tsx
│       │   │   ├── AnnotationPanel.module.css
│       │   │   └── index.ts
│       │   │
│       │   └── /HighlightPopup
│       │       ├── HighlightPopup.tsx
│       │       ├── HighlightPopup.module.css
│       │       └── index.ts
│       │
│       └── AnnotationPage.tsx
│
├── /shared
│   ├── /components
│   │   ├── /UI
│   │   │   ├── /Button
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.module.css
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── /ProgressBar
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   ├── ProgressBar.module.css
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── /ThemeToggle
│   │   │       ├── ThemeToggle.tsx
│   │   │       ├── ThemeToggle.module.css
│   │   │       └── index.ts
│   │   │
│   │   └── /SyncStatusBadge
│   │       ├── SyncStatusBadge.tsx
│   │       ├── SyncStatusBadge.module.css
│   │       └── index.ts
│   │
│   └── /hooks
│       ├── useFirestore.ts
│       └── useSync.ts
│
├── /context
│   ├── AuthContext.tsx
│   └── AppContext.tsx
│
├── /types
│   ├── AuthContextTypes.ts
│   ├── booksType.ts
│   ├── styled.d.ts
│   └── index.ts
│
├── /constants
│   ├── theme.ts
│   ├── breakpoints.ts
│   └── index.ts
│
├── /utils
│   ├── fileParser.ts
│   ├── storageUtils.ts
│   ├── firestoreUtils.ts
│   └── errorUtils.ts
│
├── /assets
│   ├── /fonts
│   ├── /icons
│   ├── /theme
│   └── /styles
│       ├── globals.css
│       ├── variables.css
│       ├── animations.css
│       └── utilities.css
│
├── App.tsx
├── main.tsx
├── index.css
├── vite-env.d.ts
└── /tests
    ├── /unit
    └── /e2e
