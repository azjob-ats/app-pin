import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '@env/environment';
import { ResumeApi } from '@shared/apis/resume.api';
import { TrackProgressStatus } from '@shared/enums/resume-track.enum';
import { CurrentUserService } from '@shared/services/current-user.service';
import { catchError, map, of } from 'rxjs';

const REQUIRED_COMPLETED_TRACKS = 5;

export const ownerPortfolioGuard: CanActivateFn = (route) => {
  const handle = route.paramMap.get('handle') ?? '';
  const currentUser = inject(CurrentUserService);
  const router = inject(Router);

  if (!currentUser.isOwner(handle)) {
    return true;
  }

  const api = inject(ResumeApi);
  const resumeRedirect = router.parseUrl(`/${environment.ROUTES.RESUME.COMPLETE}`);

  return api.getDraft().pipe(
    map((response) => {
      if (!response.success || !response.data) return resumeRedirect;
      const completed = Object.values(response.data.tracks).filter(
        (t) => t.status === TrackProgressStatus.Completed,
      ).length;
      return completed >= REQUIRED_COMPLETED_TRACKS ? true : resumeRedirect;
    }),
    catchError(() => of(resumeRedirect)),
  );
};
