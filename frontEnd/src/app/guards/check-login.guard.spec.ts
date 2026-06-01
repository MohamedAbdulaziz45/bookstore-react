import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { CheckLoginGuard } from "./check-login.guard";

describe("profileCompleteGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => CheckLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });
});
