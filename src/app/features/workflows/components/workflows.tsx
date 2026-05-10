"use client";

import { useSuspenseWorkflows } from "../hooks/use-workflows"
import { EntityHeader, EntityContainer } from "@/components/created-ui/entity-components";

import { useCreateWorkflow } from "../hooks/use-workflows";
import { useRouter } from "next/navigation";
import { useUpgradeModal } from "../hooks/use-upgrade-modal";


export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();

  return (<>
    {JSON.stringify(workflows.data, null, 2)}
  </>
  )
};



export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {

  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  }


  return (<>
    {modal}
    <EntityHeader
      title="Workflows"
      description="Create and manage your workflows"
      onNew={handleCreate}
      newButtonLabel="New Workflow"
      disabled={disabled}
      isCreating={createWorkflow.isPending}
    />
  </>)
}



export const WorkflowsContainer = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntityContainer>
  );
};
