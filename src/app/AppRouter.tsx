import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./MainLayout";
import { AuthPage, LibraryPage, ReaderPage, CollectionsPage, AnnotationPage } from "/features/";

<Routes>
  {/* авторизация */}
  <Route path="/auth" element={<AuthPage />} />

  {/* основные маршруты с layout */}
  <Route element={<MainLayout />}>
    {/* библиотека */}
    <Route path="/library" element={<LibraryPage />} />

    {/* читалка */}
    <Route path="/reader/:bookId" element={<ReaderPage />} />

    {/* коллекции */}
    <Route path="/collections" element={<CollectionsPage />} />
    <Route path="/collections/:collectionId" element={<CollectionsPage />} />

    {/* аннотации */}
    <Route path="/annotations/:bookId" element={<AnnotationPage />} />

    {/* перенаправление */}
    <Route path="/" element={<Navigate to="/library" replace />} />
    <Route path="*" element={<Navigate to="/library" replace />} />
  </Route>
</Routes>;
