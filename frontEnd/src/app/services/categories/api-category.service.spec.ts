import { TestBed } from "@angular/core/testing";

import { CategoryService } from "./api-category.service";

describe("CategoryService", () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
