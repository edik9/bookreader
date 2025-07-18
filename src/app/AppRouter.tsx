// src/app/AppRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { ProtectedRoute } from '@/context/AuthContext';
import {
  AuthPage,
  LibraryPage,
  ReaderPage,
  CollectionsPage,
  AnnotationPage
} from '@features';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Приватные маршруты с MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/library" element={
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        } />

        <Route path="/reader/:bookId" element={
          <ProtectedRoute>
            <ReaderPage />
          </ProtectedRoute>
        } />

        <Route path="/collections" element={
          <ProtectedRoute>
            <CollectionsPage />
          </ProtectedRoute>
        } />

        <Route path="/collections/:collectionId" element={
          <ProtectedRoute>
            <CollectionsPage />
          </ProtectedRoute>
        } />

        <Route path="/annotations/:bookId" element={
          <ProtectedRoute>
            <AnnotationPage />
          </ProtectedRoute>
        } />

        {/* Перенаправления */}
        <Route path="/" element={<Navigate to="/library" replace />} />
        <Route path="*" element={<Navigate to="/library" replace />} />
      </Route>
    </Routes>
  );
};