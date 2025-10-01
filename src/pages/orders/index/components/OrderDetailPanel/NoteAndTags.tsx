import PrimaryButton from "@/components/Button";
import FormAutocomplete from "@/components/form/FormAutocomplete";
import { FormInputTextArea } from "@/components/form/FormTextArea";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";

export default function NoteAndTags({
  note,
  tags,
}: {
  note: string;
  tags: string[];
}) {
  const { control } = useForm({
    defaultValues: { note, tags },
  });
  return (
    <Box
      sx={{
        minHeight: 250,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <FormInputTextArea
        name="note"
        control={control}
        placeholder="Note"
        minRows={5}
      />
      <FormAutocomplete
        multiple
        name="tags"
        label="Tags"
        control={control}
        options={["tag1", "tag2"]}
      />
      <PrimaryButton label="Update" onClick={() => {}} />
    </Box>
  );
}
