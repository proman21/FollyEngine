import { TestBed } from '@angular/core/testing';

import { FlowEditorService } from './flow-editor.service';
import { boolType, floatType, intType, strType } from "./intrinsics";
import { ArrayType } from "./types";

describe('FlowEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlowEditorService = TestBed.get(FlowEditorService);
    expect(service).toBeTruthy();
  });

  it("#resolveType should return all primitive types", function() {
    const service: FlowEditorService = TestBed.get(FlowEditorService);
    expect(service.resolveType('float')).toBe(floatType);
    expect(service.resolveType('int')).toBe(intType);
    expect(service.resolveType('str')).toBe(strType);
    expect(service.resolveType('bool')).toBe(boolType);
  });

  it("#resolveType should resolve Array types of any depth", function() {
    const service: FlowEditorService = TestBed.get(FlowEditorService);
    expect(service.resolveType('Array<bool>'))
      .toBe(new ArrayType(boolType));
    expect(service.resolveType('Array<str>'))
      .toBe(new ArrayType(strType));
    expect(service.resolveType('Array<Array<str>>'))
      .toBe(new ArrayType(new ArrayType(strType)));
    expect(service.resolveType('Array<Array<Array<Array<Array<str>>>>>>>>'))
      .toBe(new ArrayType(new ArrayType(new ArrayType(new ArrayType(strType)))));
  });
});
