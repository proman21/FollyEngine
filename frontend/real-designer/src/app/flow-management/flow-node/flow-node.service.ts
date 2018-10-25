import { Injectable } from '@angular/core';

import * as $ from 'jquery';
import * as joint from 'jointjs';

import { DesignerService } from './../../designer/designer.service';
import { ConditionNodeComponent } from './condition-node.component';
import { OperationNodeComponent } from './operation-node.component';
import { ActionNodeComponent } from './action-node.component';
import { TriggerNodeComponent } from './trigger-node.component';
import { NestedFlowNodeComponent } from './nested-flow-node.component';
import { InstanceNodeComponent } from './instance-node.component';
import { GateNodeComponent } from './gate-node.component';
import { FlowNodeView } from './flow-node.view';

joint.shapes['folly'] = {};
joint.shapes.basic['PortsModel'] = joint.shapes.basic.Generic.extend(joint.shapes.basic['PortsModelInterface']);

interface FlowNodeOptions {
  entities: any[];
  attributes: { [x: number]: string };
  flows: any[];
  assets: any[];
}

@Injectable()
export class FlowNodeService {
  options: FlowNodeOptions = {
    entities: null,
    attributes: null,
    flows: null,
    assets: null
  };
  defaults: any = {};

  constructor(private designerService: DesignerService) {
    // ConditionNode
    this.define('ConditionNode', ConditionNodeComponent, {
      outPorts: ['True', 'False']
    });

    // OperationNode
    this.define('OperationNode', OperationNodeComponent);

    // ActionNode
    this.define('ActionNode', ActionNodeComponent, {
      size: { width: 240, height: 160 }
    });

    // TriggerNode
    this.define('TriggerNode', TriggerNodeComponent, {
      size: { width: 220, height: 140 }
    });

    // NestedFlowNode
    this.define('NestedFlowNode', NestedFlowNodeComponent, {
      size: { width: 220, height: 60 }
    });

    // InstanceNode
    this.define('InstanceNode', InstanceNodeComponent, {
      size: { width: 220, height: 90 }
    });

    // GateNode
    this.define('GateNode', GateNodeComponent, {
      inPorts: ['left', 'right'],
      size: { width: 200, height: 60 }
    });
  }

  define(type: any, component: any, defaultAttributes?: {}) {
    // declare class and functions
    joint.shapes['folly'][type] = class extends joint.shapes.basic['PortsModel'] {};

    // define defaults property
    if (!defaultAttributes) {
      defaultAttributes = {};
    }
    Object.defineProperty(joint.shapes['folly'][type].prototype, 'defaults', {
      get: () => {
        return {
          ...joint.shapes.basic['PortsModel'].prototype.defaults,
          type: `folly.${type}`,
          size: { width: 240, height: 200 },
          inPorts: ['In'],
          outPorts: ['Out'],
          attrs: {
            '.': { magnet: false },
            rect: { stroke: 'none', 'fill-opacity': 0, width: '100%', height: '100%' },
            circle: { r: 8, magnet: true },
            '.inPorts circle': { fill: 'green', magnet: 'passive', type: 'input' },
            '.outPorts circle': { fill: 'red', type: 'output' },
            '.outPorts text': { dx: '-12px', dy: '4px', 'text-anchor': 'end' }
          },
          ...defaultAttributes
        };
      }
    });

    // store defaults
    this.defaults[`folly.${type}`] = {};
    Object.assign(this.defaults[`folly.${type}`], joint.shapes['folly'][type].prototype.defaults);
    delete this.defaults[`folly.${type}`]['type'];

    // define markup property
    Object.defineProperty(joint.shapes['folly'][type].prototype, 'markup', {
      get: () => `<g class="rotatable">
        <g class="scalable">
          <rect/>
        </g>
        <g class="inPorts"/>
        <g class="outPorts"/>
      </g>`
    });

    joint.shapes['folly'][type].prototype.getPortAttrs = function(portName, index, total, selector, type) {
      return FlowNodeService.getPortAttrs.apply(this, arguments);
    };

    // define view class
    joint.shapes['folly'][`${type}View`] = function() {
      return FlowNodeView.apply(this, arguments);
    };
    joint.shapes['folly'][`${type}View`].prototype = Object.create(FlowNodeView.prototype, {
      constructor: {
        value: joint.shapes['folly'][`${type}View`],
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(joint.shapes['folly'][`${type}View`].prototype, 'component', {
      value: component,
      writable: true
    });
  }

  update() {
    const entities = this.designerService.getEntities();
    const components = this.designerService.getComponents();
    const flows = this.designerService.getFlows();
    const assets = this.designerService.getAssets();

    this.options.entities = Array.from(entities).reduce((s, [key, value]) => {
      s.push(value);
      return s;
    }, []);

    const attributeOptions = {};
    entities.forEach(e => {
      attributeOptions[e.id] = [];
      e.components.forEach(c => {
        components.get(c).attributes.forEach(function(attr) {
          attributeOptions[e.id].push(attr.name);
        });
      });
    });
    this.options.attributes = attributeOptions;

    this.options.flows = Array.from(flows).reduce((s, [key, value]) => {
      // TODO
      //if (key !== this.flow.id) {
      s.push(value);
      //}
      return s;
    }, []);

    this.options.assets = Array.from(assets).reduce((s, [key, value]) => {
      s.push(value);
      return s;
    }, []);
  }

  static getPortAttrs(portName, index, total, selector, type) {
    const attrs = {};
    const portClass = 'port' + index;
    const portSelector = selector + '>.' + portClass;
    const portCircleSelector = portSelector + '>circle';

    attrs[portCircleSelector] = { port: { id: portName, type: type } };
    attrs[portSelector] = { ref: 'rect', 'ref-y': (index + 0.5) * (1 / total) };

    if (selector === '.outPorts') {
      attrs[portSelector]['ref-dx'] = 0;
    }

    return attrs;
  }
}
