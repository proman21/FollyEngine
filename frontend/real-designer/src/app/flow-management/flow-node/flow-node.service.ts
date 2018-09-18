import { Injectable } from '@angular/core';

import * as $ from 'jquery';
import * as joint from 'jointjs';

import { DesignerService } from './../../designer/designer.service';
import { FlowNodeView } from './flow-node.view';

joint.shapes['folly'] = {};
joint.shapes.basic['PortsModel'] = joint.shapes.basic.Generic.extend(joint.shapes.basic['PortsModelInterface']);

interface FlowNodeOptions {
  entities: string;
  attributes: { [x: number]: string };
  flows: string;
  assets: string;
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
    this.define(
      'ConditionNode',
      options => {
        const conditionOptions = [
          'Equal to',
          'Greater than',
          'Less than',
          'Greater than or equal to',
          'Less than or equal to'
        ].reduce<string>((s, value) => {
          s += `<option>${value}</option>`;
          return s;
        }, '');
        return `<span class="node-caption">Condition</span>
          <div class="input-group">
            <input name="name" type="text" value="New Condition"/>
          </div>
          <div class="input-group">
            <label>Entity</label>
            <select name="entity">${options.entities}</select>
            <label>Attribute</label>
            <select name="attr">${options.attributes[Object.keys(options.attributes)[0]]}</select>
          </div>
          <div class="input-group">
            <label>is</label>
            <select name="action">${conditionOptions}</select>
          </div>
          <div class="input-group">
            <label>Value</label>
            <input name="value" type="text" value=""/>
          </div>`;
      },
      {
        outPorts: ['True', 'False']
      }
    );

    // OperationNode
    this.define('OperationNode', options => {
      const operationOptions = ['Add', 'Subtract', 'Set'].reduce<string>((s, value) => {
        s += `<option>${value}</option>`;
        return s;
      }, '');
      return `<span class="node-caption">Operation</span>
          <div class="input-group">
            <input name="name" type="text" value="New Operation"/>
          </div>
          <div class="input-group">
            <label>Entity</label>
            <select name="entity">${options.entities}</select>
            <label>Attribute</label>
            <select name="attr">${options.attributes[Object.keys(options.attributes)[0]]}</select>
          </div>
          <div class="input-group">
            <label>Action</label>
            <select name="action">${operationOptions}</select>
          </div>
          <div class="input-group">
            <label>Value</label>
            <input name="value" type="text" value=""/>
          </div>`;
    });

    // ActionNode
    this.define(
      'ActionNode',
      options => {
        return `<span class="node-caption">Action</span>
          <div class="input-group">
            <input name="name" type="text" value="New Action"/>
          </div>
          <div class="input-group">
            <label>Entity</label>
            <select name="entity">${options.entities}</select>
            <label>Attribute</label>
            <select name="attr">${options.attributes[Object.keys(options.attributes)[0]]}</select>
          </div>
          <div class="input-group">
            <label>File</label>
            <select name="action">${options.assets}</select>
          </div>`;
      },
      {
        size: { width: 240, height: 160 }
      }
    );

    // TriggerNode
    this.define(
      'TriggerNode',
      options => {
        const triggerOptions = ['RFID'].reduce<string>((s, value) => {
          s += `<option>${value}</option>`;
          return s;
        }, '');
        return `<span class="node-caption">Trigger</span>
          <div class="input-group">
            <input name="name" type="text" value="New Trigger"/>
          </div>
          <div class="input-group">
            <label>Type</label>
            <select name="trigger">${triggerOptions}</select>
          </div>
          <div class="input-group">
            <label>Entity</label>
            <select name="entity">${options.entities}</select>
          </div>`;
      },
      {
        size: { width: 220, height: 140 }
      }
    );

    // NestedFlowNode
    this.define(
      'NestedFlowNode',
      options => {
        return `<div class="input-group">
          <label>Flow</label>
          <select name="flow">${options.flows}</select>
        </div>`;
      },
      {
        size: { width: 220, height: 60 }
      }
    );
  }

  define(type: string, template: (options: FlowNodeOptions) => string, defaultAttributes?: {}) {
    // declare class and functions
    joint.shapes['folly'][type] = class extends joint.shapes.basic['PortsModel'] {};
    joint.shapes['folly'][type].prototype.template = template;

    // define defaults property
    if (!defaultAttributes) {
      defaultAttributes = {};
    }
    Object.defineProperty(joint.shapes['folly'][type].prototype, 'defaults', {
      get: () => {
        return {
          ...joint.shapes.basic['PortsModel'].prototype.defaults,
          type: `folly.${type}`,
          size: { width: 240, height: 180 },
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
          <foreignObject>
            <div xmlns="http://www.w3.org/1999/xhtml" class="flow-node">
              ${joint.shapes['folly'][type].prototype.template.call(this, this.options)}
            </div>
          </foreignObject>
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
  }

  update() {
    const entities = this.designerService.getEntities();
    const components = this.designerService.getComponents();
    const flows = this.designerService.getFlows();
    const assets = this.designerService.getAssets();

    this.options.entities = Array.from(entities).reduce<string>((s, [key, value]) => {
      s += `<option value="${value.id}">${value.name}</option>`;
      return s;
    }, '');

    const attributeOptions = {};
    entities.forEach(e => {
      attributeOptions[e.id] = '';
      e.components.forEach(c => {
        components.get(c).attributes.forEach(function(attr) {
          attributeOptions[e.id] += `<option>${attr.name}</option>`;
        });
      });
    });
    this.options.attributes = attributeOptions;

    this.options.flows = Array.from(flows).reduce<string>((s, [key, value]) => {
      // TODO
      //if (key !== this.flow.id) {
      s += `<option value="${value.id}">${value.name}</option>`;
      //}
      return s;
    }, '');

    this.options.assets = Array.from(assets).reduce<string>((s, [key, value]) => {
      s += `<option value="${value.id}">${value.name}</option>`;
      return s;
    }, '');
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
