import { useState } from "react";
import UserForm from "../../components/users/UserForm";
import UserList from "../../components/users/UserList";

const UserPage = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <UserForm onSuccess={() => setRefresh(!refresh)} />
      <UserList refresh={refresh} />
    </div>
  );
};

export default UserPage;
