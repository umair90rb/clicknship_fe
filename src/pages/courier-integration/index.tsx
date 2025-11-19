import { useState } from "react";
import CreateUpdateIntegrationModal from "./CreateUpdateIntegraionModal";

export default function CourierServices() {
  const [integrationModalOpen, setIntegrationModalOpen] = useState(true);
  return (
    <>
      <CreateUpdateIntegrationModal
        open={integrationModalOpen}
        setOpen={setIntegrationModalOpen}
      />
    </>
  );
}
