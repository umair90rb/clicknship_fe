import { useListPermissionsQuery } from "@/api/role";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useState } from "react";

interface Permission {
  resource: string;
  actions: string[];
}
interface PermissionProps {
  permission: Permission;
}
function Permission({ permission }: PermissionProps) {
  const { resource, actions } = permission;
  return (
    <TreeItem itemId={resource} label={resource}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        {actions.map((action) => (
          <TreeItem itemId={`${resource}:${action}`} label={action} />
        ))}
      </Box>
    </TreeItem>
  );
}

export default function CreateUpdateRole() {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { data, isLoading } = useListPermissionsQuery({});
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <SimpleTreeView
      selectedItems={selectedPermissions}
      onSelectedItemsChange={(e, itemIds) => {
        console.log(itemIds);
        setSelectedPermissions(itemIds);
      }}
      selectionPropagation={{ parents: true, descendants: true }}
      checkboxSelection
      multiSelect
      disabledItemsFocusable
    >
      {data.map((permission: Permission) => (
        <Permission permission={permission} />
      ))}
    </SimpleTreeView>
  );
}
