import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";

import LeftPanel from "../resizable-panels/components/MainWorkspace/LeftPanel";
import MainPanel from "../resizable-panels/components/MainWorkspace/MainPanel";
import RightPanel from "../resizable-panels/components/MainWorkspace/RightPanel";
import "./MainWorkspaceLayout.css";

export default function MainWorkspaceLayout() {
  return (
    <div className="workspace-container">
      <PanelGroup direction="horizontal">
        
        {/* LEFT PANEL - Patient Info */}
        <Panel 
          defaultSize={25} 
          minSize={20} 
          maxSize={35}
          className="panel-left"
        >
          <LeftPanel />
        </Panel>

        <PanelResizeHandle className="resize-handle" />

        {/* MAIN PANEL - Medical Notes Editor */}
        <Panel 
          defaultSize={50} 
          minSize={40}
          className="panel-main"
        >
          <MainPanel />
        </Panel>

        <PanelResizeHandle className="resize-handle" />

        {/* RIGHT PANEL - Notes History */}
        <Panel 
          defaultSize={25} 
          minSize={20} 
          maxSize={35}
          className="panel-right"
        >
          <RightPanel />
        </Panel>

      </PanelGroup>
    </div>
  );
}