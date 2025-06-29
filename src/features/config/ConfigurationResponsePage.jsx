import { useEffect, useState } from "react";

function ConfigurationResponsePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userData = {
      name: params.get("name"),
      email: params.get("email"),
      picture: params.get("picture"),
      account_id: params.get("account_id"),
    };

    if (userData.account_id) {
      setUser(userData);
      window.history.replaceState({}, "", "/profile");
    }
  }, []);

  if (!user) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <img src={user.picture} alt="Foto" width="100" style={{ borderRadius: "50%" }} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p><strong>ID de Cuenta:</strong> {user.account_id}</p>
    </div>
  );
}

export default ConfigurationResponsePage
