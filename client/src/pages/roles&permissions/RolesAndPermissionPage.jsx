import { useState } from "react";
import RolesAndPermissionForm from "../../components/roles&permissions/RolesAndPermissionForm";
import RolesAndPermissionList from "../../components/roles&permissions/RolesAndPermissionList";

const RolesAndPermissionPage = () => {
  const [editUserId, setEditUserId] = useState(null);
  const [editPermissions, setEditPermissions] = useState([]);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="space-y-6">
      <RolesAndPermissionForm
        editUserId={editUserId}
        editPermissions={editPermissions}
        clearEdit={() => {
          setEditUserId(null);
          setEditPermissions([]);
        }}
        onSuccess={() => {
          setRefresh((p) => !p);
          setEditUserId(null);
          setEditPermissions([]);
        }}
      />

      <RolesAndPermissionList
        refresh={refresh}
        onEdit={(userId, permissions) => {
          setEditUserId(userId);
          setEditPermissions(permissions);
        }}
      />
    </div>
  );
};

export default RolesAndPermissionPage;
