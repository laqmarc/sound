import { Handle as FlowHandle, useNodeId } from 'reactflow';
import type { ComponentProps } from 'react';

// Instrument controls also render as a standalone mobile editor. The graph
// owns sockets; mounting one outside a React Flow node is invalid.
export function Handle(props: ComponentProps<typeof FlowHandle>) {
  const nodeId = useNodeId();
  return nodeId ? <FlowHandle {...props} /> : null;
}
