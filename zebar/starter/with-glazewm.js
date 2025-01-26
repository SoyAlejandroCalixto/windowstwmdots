import React, { useState, useEffect } from 'https://esm.sh/react@18?dev';
import { createRoot } from 'https://esm.sh/react-dom@18/client?dev';
import * as zebar from 'https://esm.sh/zebar@2';

const providers = zebar.createProviderGroup({
  network: { type: 'network' },
  glazewm: { type: 'glazewm' },
  cpu: { type: 'cpu' },
  date: { type: 'date', formatting: 'EEE d MMM t' },
  memory: { type: 'memory' },
});

createRoot(document.getElementById('root')).render(<App />);

function App() {
  const [output, setOutput] = useState(providers.outputMap);

  useEffect(() => {
    providers.onOutput(() => setOutput(providers.outputMap));
  }, []);

  function getNetworkIcon(networkOutput) {
    switch (networkOutput.defaultInterface?.type) {
      case 'ethernet':
        return <div className="icon networkIcon">󰈁</div>;
      case 'wifi':
        if (networkOutput.defaultGateway?.signalStrength >= 80) {
          return <div className="icon networkIcon">󰤨</div>;
        } else if (
          networkOutput.defaultGateway?.signalStrength >= 65
        ) {
          return <div className="icon networkIcon">󰤥</div>;
        } else if (
          networkOutput.defaultGateway?.signalStrength >= 40
        ) {
          return <div className="icon networkIcon">󰤢</div>;
        } else if (
          networkOutput.defaultGateway?.signalStrength >= 25
        ) {
          return <div className="icon networkIcon">󰤟</div>;
        } else {
          return <div className="icon networkIcon">󰤯</div>;
        }
      default:
        return (
          <div className="icon networkIcon">󰤮</div>
        );
    }
  }

  function getBatteryIcon(batteryOutput) {
    if (batteryOutput.chargePercent > 90)
      return <div className="icon batteryIcon"></div>;
    if (batteryOutput.chargePercent > 70)
      return <div className="icon batteryIcon"></div>;
    if (batteryOutput.chargePercent > 40)
      return <div className="icon batteryIcon"></div>;
    if (batteryOutput.chargePercent > 20)
      return <div className="icon batteryIcon"></div>;
    return <div className="icon batteryIcon"></div>;
  }

  return (
    <div className="app">
      <div className="left">

      </div>

      <div className="center">
        {output.glazewm && (
          <div className="workspaces">
            {output.glazewm.currentWorkspaces.map(workspace => (
              <button className={`workspace 
                ${workspace.hasFocus && 'focused'} 
                ${workspace.isDisplayed && 'displayed'} 
                ${workspace.children.length === 0 && 'empty'}
              `}
                onClick={() =>
                  output.glazewm.runCommand(`focus --workspace ${workspace.name}`)
                }
                key={workspace.name}
              >
                {workspace.hasFocus ? '' : (workspace.children.length > 0 ? '' : '')}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="right">
        {output.network && (
          <div className="network">
            {getNetworkIcon(output.network)}
            {output.network.defaultGateway?.ssid}
          </div>
        )}

        {output.memory && (
          <div className="memory">
            <div className="icon ramIcon"></div>
            {Math.round(output.memory.usage)}%
          </div>
        )}

        {output.cpu && (
          <div className="cpu">
            <div className="icon cpuIcon"></div>
            <span className={output.cpu.usage > 85 ? 'high-usage' : ''}>{Math.round(output.cpu.usage)}%</span>
          </div>
        )}

        <div className="date">
          <div className="icon clockIcon">󰥔</div>
          {output.date?.formatted}
        </div>
      </div>
    </div>
  );
}

