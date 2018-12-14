import { TestBed } from '@angular/core/testing';

import { FlowService } from './flow.service';
import { boolType, floatType, intType, strType } from "./intrinsics";
import { ArrayType } from "./types";

describe('FlowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlowService = TestBed.get(FlowService);
    expect(service).toBeTruthy();
  });

  it("#resolveType should return all primitive types", function() {
    const service: FlowService = TestBed.get(FlowService);
    expect(service.resolveType('float')).toBe(floatType);
    expect(service.resolveType('int')).toBe(intType);
    expect(service.resolveType('str')).toBe(strType);
    expect(service.resolveType('bool')).toBe(boolType);
  });

  it("#resolveType should resolve Array types of any depth", function() {
    const service: FlowService = TestBed.get(FlowService);
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
