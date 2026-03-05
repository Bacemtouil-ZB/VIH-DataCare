import { useRef, useState } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";

import LeftPanel from "../components/layout/PanelGroup/LeftPanel";
import MainPanel from "../components/layout/PanelGroup/MainPanel";
import RightPanel from "../components/layout/PanelGroup/RightPanel";
import Header from "./../components/layout/Header";
import "./MainWorkspaceLayout.css";

export default function MainWorkspaceLayout() {

  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const [leftClosed, setLeftClosed] = useState(false);
  const [rightClosed, setRightClosed] = useState(false);

  return (
    <div className="workspace-container">
      <Header />

      <PanelGroup direction="horizontal">

        {/* LEFT PANEL */}
        <Panel
          ref={leftRef}
          defaultSize={18}
          minSize={0}
          maxSize={20}
          collapsible
          onCollapse={() => setLeftClosed(true)}
          onExpand={() => setLeftClosed(false)}
          className="panel-left"
        >
          <LeftPanel />
        </Panel>

        {/* LEFT HANDLE */}
        <PanelResizeHandle
          className={`resize-handle ${leftClosed ? "collapsed" : ""}`}
          onDoubleClick={() => leftRef.current?.expand()}
        >
          {leftClosed && <span className="handle-arrow">›</span>}
        </PanelResizeHandle>


        {/* MAIN PANEL */}
        <Panel defaultSize={64} minSize={40} className="panel-main">
          <MainPanel />
        </Panel>


        {/* RIGHT HANDLE */}
        <PanelResizeHandle
          className={`resize-handle ${rightClosed ? "collapsed" : ""}`}
          onDoubleClick={() => rightRef.current?.expand()}
        >
          {rightClosed && <span className="handle-arrow">‹</span>}
        </PanelResizeHandle>


        {/* RIGHT PANEL */}
        <Panel
          ref={rightRef}
          defaultSize={18}
          minSize={0}
          maxSize={18}
          collapsible
          onCollapse={() => setRightClosed(true)}
          onExpand={() => setRightClosed(false)}
          className="panel-right"
        >
          <RightPanel />
        </Panel>

      </PanelGroup>
    </div>
  );
}
