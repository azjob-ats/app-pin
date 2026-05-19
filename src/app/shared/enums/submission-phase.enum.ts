export enum SubmissionPhase {
  // Job pipeline
  JobReceived = 'job_received',
  JobAdequate = 'job_adequate',
  JobInterview = 'job_interview',
  JobDocuments = 'job_documents',
  JobApproved = 'job_approved',
  JobRejected = 'job_rejected',

  // Service pipeline
  ServiceReceived = 'service_received',
  ServiceQualified = 'service_qualified',
  ServiceMeeting = 'service_meeting',
  ServiceProposal = 'service_proposal',
  ServiceClosed = 'service_closed',
  ServiceLost = 'service_lost',

  // Training pipeline
  TrainingEnrolled = 'training_enrolled',
  TrainingConfirmed = 'training_confirmed',
  TrainingPresent = 'training_present',
  TrainingCompleted = 'training_completed',
  TrainingCertified = 'training_certified',

  // News pipeline
  NewsReceived = 'news_received',
  NewsSegmented = 'news_segmented',
  NewsEngaged = 'news_engaged',
  NewsSubscriber = 'news_subscriber',

  // Experience pipeline
  ExperienceRequested = 'experience_requested',
  ExperienceScheduled = 'experience_scheduled',
  ExperienceConfirmed = 'experience_confirmed',
  ExperienceFulfilled = 'experience_fulfilled',
}
