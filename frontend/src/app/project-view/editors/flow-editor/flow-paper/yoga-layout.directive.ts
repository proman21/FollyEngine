import {
  AfterContentChecked,
  AfterContentInit, AfterViewChecked,
  AfterViewInit, ChangeDetectorRef,
  ContentChildren,
  Directive,
  ElementRef,
  Input, OnDestroy,
  QueryList, ViewChildren
} from "@angular/core";
import {
  EDGE_ALL,
  EDGE_BOTTOM, EDGE_END, EDGE_HORIZONTAL,
  EDGE_LEFT, EDGE_RIGHT, EDGE_START, EDGE_TOP, EDGE_VERTICAL,
  Node,
  YogaAlign,
  YogaDisplay,
  YogaFlexDirection,
  YogaFlexWrap,
  YogaJustifyContent,
  YogaNode, YogaOverflow, YogaPositionType
} from "yoga-layout";

function setEdgeProp(values: YogaEdgeMap, set: (e, v) => void) {
  for(const [edge, value] of Object.entries(values)) {
    switch (edge) {
      case 'left': set(EDGE_LEFT, value); break;
      case 'top': set(EDGE_TOP, value); break;
      case 'right': set(EDGE_RIGHT, value); break;
      case 'bottom': set(EDGE_BOTTOM, value); break;
      case 'start': set(EDGE_START, value); break;
      case 'end': set(EDGE_END, value); break;
      case 'horizontal': set(EDGE_HORIZONTAL, value); break;
      case 'vertical': set(EDGE_VERTICAL, value); break;
      case 'all': set(EDGE_ALL, value); break;
    }
  }
}

function setPercentProp(value: number | string, set: (n: number | string) => void, setPercent: (n: number) => void) {
  if (typeof value === 'string') {
    const percentMatch = /^(\d+\.\d*)%$/.exec(value);
    if (percentMatch) {
      setPercent(Number(percentMatch[1]));
    } else {
      set(value);
    }
  } else {
    set(value);
  }
}

function setPercentAutoProp(value: number | string, set: (n: number) => void, setPercent: (n: number) => void, setAuto: () => void) {
  if (typeof value === 'string') {
    const percentMatch = /^(\d+\.\d*)%$/.exec(value);
    if (percentMatch) {
      setPercent(Number(percentMatch[1]));
    } else {
      if (value === "auto") {
        setAuto();
      }
    }
  } else {
    set(value);
  }
}

export interface YogaEdgeMap {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  start?: number;
  end?: number;
  horizontal?: number;
  vertical?: number;
  all?: number;
}

export interface YogaLayoutOptions {
  alignContent?: YogaAlign;
  alignItems?: YogaAlign;
  alignSelf?: YogaAlign;
  aspectRatio?: number;
  border?: YogaEdgeMap;
  display?: YogaDisplay;
  flex?: number;
  flexBasis?: number | string;
  flexDirection?: YogaFlexDirection;
  flexGrow?: number;
  flexShrink?: number;
  flexWrap?: YogaFlexWrap;
  height?: number | string;
  justifyContent?: YogaJustifyContent;
  margin?: YogaEdgeMap;
  maxHeight?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  overflow?: YogaOverflow;
  padding?: YogaEdgeMap;
  position?: YogaEdgeMap;
  positionType?: YogaPositionType;
  width?: number | string;
}

@Directive({
  selector: '[yogaLayout]',
  exportAs: 'yogaLayout'
})
export class YogaLayoutDirective implements AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input()
  set yogaLayout(config: YogaLayoutOptions) {
    for (const [k, v] of Object.entries(config)) {
      switch(k) {
        case 'alignContent':
          this.node.setAlignContent(v); break;
        case 'alignItems':
          this.node.setAlignItems(v); break;
        case 'alignSelf':
          this.node.setAlignSelf(v); break;
        case 'aspectRatio':
          this.node.setAspectRatio(v); break;
        case 'border':
          setEdgeProp(v,
            (e, n) => this.node.setBorder(e, n)); break;
        case 'display':
          this.node.setDisplay(v); break;
        case 'flex':
          this.node.setFlex(v); break;
        case 'flexBasis':
          setPercentProp(v,
            (n) => this.node.setFlexBasis(n),
            (n) => this.node.setFlexBasisPercent(n)); break;
        case 'flexDirection':
          this.node.setFlexDirection(v); break;
        case 'flexGrow':
          this.node.setFlexGrow(v); break;
        case 'flexShrink':
          this.node.setFlexShrink(v); break;
        case 'flexWrap':
          this.node.setFlexWrap(v); break;
        case 'height':
          setPercentAutoProp(v,
            (n) => this.node.setHeight(n),
            (n) => this.node.setHeightPercent(n),
            () => this.node.setHeightAuto()); break;
        case 'justifyContent':
          this.node.setJustifyContent(v); break;
        case 'margin':
          setEdgeProp(v, (e, val) => {
            setPercentAutoProp(val,
              (n) => this.node.setMargin(e, n),
              (n) => this.node.setMarginPercent(e, n),
              () => this.node.setMarginAuto(e)
              );
          }); break;
        case 'maxHeight':
          setPercentProp(v,
            (n) => this.node.setMaxHeight(n),
            (n) => this.node.setMaxHeightPercent(n)); break;
        case 'maxWidth':
          setPercentProp(v,
            (n) => this.node.setMaxWidth(n),
            (n) => this.node.setMaxWidthPercent(n)); break;
        case 'minHeight':
          setPercentProp(v,
            (n) => this.node.setMinHeight(n),
            (n) => this.node.setMinHeightPercent(n)); break;
        case 'minWidth':
          setPercentProp(v,
            (n) => this.node.setMaxWidth(n),
            (n) => this.node.setMaxWidthPercent(n)); break;
        case 'overflow':
          this.node.setOverflow(v); break;
        case 'padding':
          setEdgeProp(v, (e, val) => {
            setPercentProp(val,
              (n) => this.node.setPadding(e, n),
              (n) => this.node.setPaddingPercent(e, n),
            );
          }); break;
        case 'position':
          setEdgeProp(v, (e, val) => {
            setPercentProp(val,
              (n) => this.node.setPosition(e, n),
              (n) => this.node.setPositionPercent(e, n),
            );
          }); break;
        case 'width':
          setPercentAutoProp(v,
            (n) => this.node.setWidth(n),
            (n) => this.node.setWidthPercent(n),
            () => this.node.setWidthAuto()); break;
      }
    }
  }
  @ContentChildren(YogaLayoutDirective)
  childNodes: QueryList<YogaLayoutDirective>;
  node: YogaNode;
  root = true;

  get layout() {
    return this.node.getComputedLayout();
  }

  get x() {
    if (this.layout.right !== 0) {
      return this.layout.width - this.layout.right;
    } else {
      return this.layout.left;
    }
  }

  get y() {
    if (this.layout.bottom !== 0) {
      return this.layout.height - this.layout.bottom;
    } else {
      return this.layout.bottom;
    }
  }

  constructor(
    private ref: ElementRef<Element>,
    private cd: ChangeDetectorRef
  ) {
    this.node = Node.createDefault();
  }

  ngAfterContentInit(): void {
    this.setupChildren();
  }

  /**
   * Descend the layout tree and add child nodes to current node.
   */
  ngAfterContentChecked(): void {
    if (this.childNodes.dirty) {
      this.setupChildren();
    }
  }

  setupChildren() {
    if (this.childNodes.length > 1) {
      this.node.setMeasureFunc(null);
      while (this.node.getChildCount() > 0) {
        this.node.removeChild(this.node.getChild(0));
      }
      this.childNodes
        .filter((yg) => yg.node !== this.node)
        .forEach((yg, index) => {
          yg.root = false;
          this.node.insertChild(yg.node, index);
        });
    } else {
      this.node.setMeasureFunc(
        () => {
          if (this.ref.nativeElement instanceof SVGGraphicsElement) {
            return this.ref.nativeElement.getBBox();
          }
          return this.ref.nativeElement.getBoundingClientRect();
        }
      );
    }
  }

  ngAfterViewInit(): void {
    if (this.root) {
      this.node.calculateLayout();
      this.cd.detectChanges();
    }
  }

  /**
   * Ascend the tree to the root and then perform the layout calculation.
   */
  ngAfterViewChecked(): void {
    if (this.root && this.node.isDirty()) {
      this.node.calculateLayout();
      this.cd.detectChanges();
    }
  }

  ngOnDestroy(): void {
    Node.destroy(this.node);
  }


}
