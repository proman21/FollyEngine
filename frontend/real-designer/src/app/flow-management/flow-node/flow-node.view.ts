import * as $ from 'jquery'
import * as joint from 'jointjs';

export class FlowNodeView extends joint.dia.ElementView { 
  paper: joint.dia.Paper;
  $box: any;

  constructor() {
    super(...arguments);
    this.listenTo(this.model, 'process:ports', this.update);
  }

  render() {
    super.render.apply(this, arguments);

    this.$box = this.paper.$el.find('[model-id="' + this.model.id + '"]');
    
    // Prevent paper from handling pointerdown.
    this.$box.find('input,select').on('mousedown click', function(evt) {
      evt.stopPropagation();
    });
    
    // React on the input change and store the input data in the cell model.
    this.$box.find('input,select').on('change', function(evt) {
      var $target = $(evt.target);
      this.model.set($target.attr('name'), $target.val());
    }.bind(this));
    this.$box.find('input,select').each(function(index, element) {
      var $element = $(element);
      var val = this.model.get($element.attr('name'));
      if (val != undefined) {
        $element.val(val);
      }
    }.bind(this));
    
    // Update the box whenever the underlying model changes.
    this.model.on('change', this.updateBox, this);
    this.updateBox();

    return this;
  }

  renderPorts() {
    // FIXME
    this.$('.inPorts').empty().append(joint.V('<g class="port0"><circle/></g>').node);
    const outPorts = Object.values(this.model['ports']).filter(p => p['type'] === 'out');
    const $outPorts = this.$('.outPorts').empty();
    const multipleOutPorts = outPorts.length > 1 ? true : false;
    $outPorts.append(joint.V('<g class="port0"><circle/><text/></g>').node);
    if (multipleOutPorts) {
      $outPorts.append(joint.V('<g class="port1"><circle/><text/></g>').node);
    }
  }

  update() {
    // First render ports so that `attrs` can be applied to those newly created DOM elements
    // in `ElementView.prototype.update()`.
    this.renderPorts();
    super.update.apply(this, arguments);
  }

  updateBox() {
    let $scalable = this.$box.find('.scalable');
    let bbox = this.model.getBBox();

    const matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/;
    let scale = $scalable.css('transform').match(matrixRegex);

    if (scale == null) {
      return;
    }

    $scalable.find('foreignObject').css({
      width: bbox.width,
      height: bbox.height,
      transform: 'scale(' + (1 / scale[1]) + ',' + (1 / scale[2]) + ')'
    });
  }
}
