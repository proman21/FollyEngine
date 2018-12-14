import { TestBed } from '@angular/core/testing';

import { FlowEditorService } from './flow-editor.service';

describe('FlowEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlowEditorService = TestBed.get(FlowEditorService);
    expect(service).toBeTruthy();
  });
});
