import {
  useCreateRoleMutation,
  useListPermissionsQuery,
  useListRoleQuery,
} from "@/api/role";
import PrimaryButton from "@/components/Button";
import HDivider from "@/components/Divider";
import { FormInputText } from "@/components/form/FormInput";
import LinkButton from "@/components/LinkButton";
import { CardHeader, Checkbox, Chip, Grid, ListItem } from "@mui/material";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorMessage } from "@/utils";

const roleCreateValidationSchema = Yup.object({
  name: Yup.string().required("Role name is required"),
});

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {actions.map((action) => (
          <TreeItem itemId={`${resource}:${action}`} label={action} />
        ))}
      </Box>
    </TreeItem>
  );
}

export default function CreateUpdateAndRoleList() {
  const [resources, setResources] = useState<string[]>([]);
  const [rawPermissions, setRawPermission] = useState<string[]>([]);

  const [selectAllPermission, setSelectAllPermission] =
    useState<boolean>(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const { data: permissionsList, isLoading: isPermissionsLoading } =
    useListPermissionsQuery({});
  const { data: rolesList, isLoading: isRolesListLoading } = useListRoleQuery(
    {}
  );
  const [createRole, { isLoading: isCreatingRole }] = useCreateRoleMutation();

  const {
    control,
    formState: { errors },
    resetField,
    setError,
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(roleCreateValidationSchema),
  });

  const onSubmit = handleSubmit(async ({ name }) => {
    if (!selectedPermissions.length) {
      setError("root", { message: "Select at least 1 permission" });
    }
    const permissionObj = {};
    for (const permission of selectedPermissions) {
      const [resource, action] = permission.split(":");
      if (!action) continue;
      if (permissionObj[resource] === undefined) {
        permissionObj[resource] = [action];
      } else {
        permissionObj[resource].push(action);
      }
    }
    const permissionsData: Permission[] = [];
    Object.keys(permissionObj).map((k) => {
      permissionsData.push({ resource: k, actions: permissionObj[k] });
    });
    // create role
    return createRole({ name, permissions: permissionsData })
      .unwrap()
      .then(() => {
        setSelectAllPermission(false);
        resetField("name");
        setSelectedPermissions([]);
      })
      .catch((error) => {
        const message = getErrorMessage(error);
        setError(message.includes("name") ? "name" : "root", {
          message,
        });
      });
  });

  useEffect(() => {
    if (Array.isArray(permissionsList) && permissionsList.length) {
      const resourcesList: string[] = [],
        rawPermissionsList: string[] = [];
      permissionsList.map(({ resource, actions }) => {
        resourcesList.push(resource);
        rawPermissionsList.push(
          ...[resource, ...actions.map((a) => `${resource}:${a}`)]
        );
      });
      setResources(resourcesList);
      setRawPermission(rawPermissionsList);
    }
  }, [permissionsList]);

  return (
    <>
      <CardHeader
        title="Available Roles"
        slotProps={{
          title: { variant: "body1", fontWeight: "bold" },
        }}
      />
      {rolesList?.map((role) => (
        <Chip label={role.name} />
      ))}
      <HDivider my={1} />
      <CardHeader
        title="Add New Role"
        slotProps={{
          title: { variant: "body1", fontWeight: "bold" },
        }}
      />
      <Grid>
        <Grid>
          <FormInputText control={control} name="name" label="Role Name" />
        </Grid>
        <CardHeader
          title="Select Role Permissions"
          slotProps={{
            title: { variant: "body2", fontWeight: "bold" },
          }}
        />
        <Grid>
          <ListItem
            secondaryAction={
              <LinkButton
                label={
                  expandedItems.length === resources.length
                    ? "Collapse all"
                    : "Expand all"
                }
                onClick={() =>
                  setExpandedItems(
                    expandedItems.length === resources.length ? [] : resources
                  )
                }
              />
            }
          >
            <Checkbox
              checked={selectAllPermission}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSelectAllPermission(event.target.checked);
                setSelectedPermissions(
                  event.target.checked ? rawPermissions : []
                );
              }}
            />
            Select All
          </ListItem>
          <SimpleTreeView
            expandedItems={expandedItems}
            onExpandedItemsChange={(e, itemIds) => {
              setExpandedItems(itemIds);
            }}
            selectedItems={selectedPermissions}
            onSelectedItemsChange={(e, itemIds) => {
              setSelectedPermissions(itemIds);
            }}
            selectionPropagation={{ parents: true, descendants: true }}
            checkboxSelection
            multiSelect
            disabledItemsFocusable
          >
            {permissionsList?.map((permission: Permission) => (
              <Permission permission={permission} />
            ))}
          </SimpleTreeView>
          <FormRootError errors={errors} />
        </Grid>
        <Grid sx={{ mt: 3 }}>
          <PrimaryButton
            fullWidth
            label="Create Role"
            loading={isCreatingRole}
            onClick={onSubmit}
          />
        </Grid>
      </Grid>
    </>
  );
}
