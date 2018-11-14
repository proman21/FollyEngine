import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  ApplicationRef
} from '@angular/core';

import * as $ from 'jquery';
import * as joint from 'jointjs';

import { AppInjector } from '../../app-injector';
import { TriggerNodeComponent } from './trigger-node.component';

export class FlowNodeView extends joint.dia.ElementView {
  private component: any;
  private componentRef: ComponentRef<any>;
  private appRef: any;

  public paper: joint.dia.Paper;
  private box: any;

  constructor() {
    super(...arguments);
    this.listenTo(this.model, 'process:ports', this.update);

    // Create a component reference from the component
    this.componentRef = AppInjector.get(ComponentFactoryResolver)
      .resolveComponentFactory(this.component)
      .create(AppInjector);

    // Attach component to the appRef so that it's inside the ng component tree
    this.appRef = AppInjector.get(ApplicationRef);
    this.appRef.attachView(this.componentRef.hostView);

    // Get DOM element from component
    this.box = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    // Prevent paper from handling pointerdown
    $(this.box).on('mousedown click', 'input,select', function(evt) {
      evt.stopPropagation();
    });

    // React on the input change and store the input data in the cell model
    if (this.componentRef.instance.form != undefined) {
      const valueKeys = Object.keys(this.componentRef.instance.form.value);
      const patch = Object.keys(this.model.attributes)
        .filter(key => valueKeys.includes(key))
        .reduce((o, key) => {
          o[key] = this.model.attributes[key];
          return o;
        }, {});
      for (const key of valueKeys) {
        if (patch[key] != undefined) {
          this.componentRef.instance.form.get(key).setValue(patch[key]);
          this.componentRef.changeDetectorRef.detectChanges();
        }
      }
      this.componentRef.instance.form.valueChanges.subscribe(value => {
        for (const key of valueKeys) {
          if (value[key] != undefined) {
            this.model.set(key, value[key]);
          }
        }
      });
    }

    // Update the box whenever the underlying model changes
    this.model.on('change', this.updateBox, this);
    // Remove the box when the model gets removed from the graph
    this.model.on('remove', this.removeBox, this);
  }

  render() {
    super.render.apply(this, arguments);
    this.paper.$el.prepend(this.box);
    this.updateBox();

    return this;
  }

  renderPorts() {
    const inPorts = Object.values(this.model['ports']).filter(p => p['type'] === 'in');
    const $inPorts = this.$('.inPorts').empty();
    const multipleInPorts = inPorts.length > 1 ? true : false;
    $inPorts.append(joint.V('<g class="port0"><rect class="port"/><text/></g>').node);
    if (multipleInPorts) {
      $inPorts.append(joint.V('<g class="port1"><rect class="port"/><text/></g>').node);
    }

    const outPorts = Object.values(this.model['ports']).filter(p => p['type'] === 'out');
    const $outPorts = this.$('.outPorts').empty();
    const multipleOutPorts = outPorts.length > 1 ? true : false;
    $outPorts.append(joint.V('<g class="port0"><rect class="port"/><text/></g>').node);
    if (multipleOutPorts) {
      $outPorts.append(joint.V('<g class="port1"><rect class="port"/><text/></g>').node);
    }
  }

  update() {
    // First render ports so that `attrs` can be applied to those newly created DOM elements
    // in `ElementView.prototype.update()`
    this.renderPorts();
    super.update.apply(this, arguments);
  }

  updateBox() {
    // Set the position and dimension of the box so that it covers the JointJS element
    const bbox = this.model.getBBox();
    $(this.box).css({
      width: bbox.width,
      height: bbox.height,
      left: bbox.x,
      top: bbox.y,
      transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
    });
  }

  removeBox(evt: any) {
    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
  }
}
