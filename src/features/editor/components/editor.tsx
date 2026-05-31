"use client";

import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { LoadingView, ErrorView } from "@/components/created-ui/entity-components";

import { useState, useCallback, type ChangeEventHandler } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type ColorMode,
  Background,
  Controls,
  MiniMap,
  Panel,
} from '@xyflow/react';
import { nodeComponents } from '@/config/node-components';
import { AddNodeButton } from "./add-node-button";

import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";

import { useMemo } from "react";
import { NodeType } from "@/generated/enums";
import { ExecuteWorkflowButton } from "./execute-workflow-button";



export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading editor" />;
};


export const Editor = ({ workflowId }: { workflowId: string }) => {

  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const setEditor = useSetAtom(editorAtom);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const [colorMode, setColorMode] = useState<ColorMode>('dark');

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const onChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    setColorMode(evt.target.value as ColorMode);
  };

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeComponents}
          onInit={setEditor}
          fitView
          proOptions={{
            hideAttribution: true, // Hide the "Powered by React Flow" attribution or logo.
          }}
          colorMode={colorMode}
          
          snapToGrid={true}
          snapGrid={[10, 10]}

          panOnScroll
          panOnDrag={false}
          selectionOnDrag

        >

          <Panel position="top-left">
            <select
              className={`xy-theme__select ${colorMode === 'dark' ? 'text-amber-50 bg-black' : 'text-black bg-white'
                }`}
              onChange={onChange}
              data-testid="colormode-select"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </Panel>

          <Panel position="top-right">
            <AddNodeButton />
          </Panel>
          {hasManualTrigger && (
            <Panel position="bottom-center">
              <ExecuteWorkflowButton workflowId={workflowId} />
            </Panel>
          )}

          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};
