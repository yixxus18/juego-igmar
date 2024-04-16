import { CanActivateFn } from '@angular/router';

export const sesionGuard: CanActivateFn = (route, state) => {
  return true;
};
