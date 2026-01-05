import { useState } from "react";
import RolesAndPermissionForm from "../../components/roles&permissions/RolesAndPermissionForm";
import RolesAndPermissionList from "../../components/roles&permissions/RolesAndPermissionList";
const RolesAndPermissionPage = () => {
  const [editRole, setEditRole] = useState(null);
  const [editPermissions, setEditPermissions] = useState([]);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="space-y-6">
      <RolesAndPermissionForm
        editRole={editRole}
        editPermissions={editPermissions}
        clearEdit={() => {
          setEditRole(null);
          setEditPermissions([]);
        }}
        onSuccess={() => {
          setRefresh(!refresh);
          setEditRole(null);
          setEditPermissions([]);
        }}
      />

      <RolesAndPermissionList
        refresh={refresh}
        onEdit={(role, permissions) => {
          setEditRole(role);
          setEditPermissions(permissions);
        }}
      />
    </div>
  );
};

export default RolesAndPermissionPage;
