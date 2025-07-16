import { useAuth } from "../hooks/useAuth";

export function Library() {
  const { user, isGuest } = useAuth();

  return (
    <div className="library-page">
      <h1>Моя библыотэка</h1>
      <p>
        {user ? `добр бобр, {user?.email}!` : isGuest ? "Вы в гостевом режиме" : "доступ запрещён"}
      </p>
    </div>
  );
}
