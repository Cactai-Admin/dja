/* Core application types aligned to the v1 schema */

export type PipelineStage = 'added_jobs' | 'preparing' | 'applied' | 'outcome';
export type ApplicationStage = 'research' | 'questions' | 'evidence' | 'resume' | 'cover_letter' | 'completed' | 'sent' | 'received' | 'interviewing' | 'offer' | 'negotiating' | 'won' | 'lost' | 'ghosted';
export type KeywordCategory = 'skill' | 'tool' | 'technology' | 'industry' | 'department' | 'role' | 'specialty' | 'soft_skill' | 'credential' | 'metric' | 'other';
export type QuestionType = 'behavioral' | 'technical' | 'situational' | 'competency' | 'values' | 'other';

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  website_url: string;
  summary: string;
  target_title: string;
  target_compensation: string;
  created_at: string;
  updated_at: string;
}

export interface JobListing {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  compensation: string;
  url: string;
  raw_description: string;
  parsed_requirements: Record<string, unknown>;
  notes: string;
  metadata: Record<string, unknown>;
  job_listing_recommended_at: string | null;
  job_listing_added_at: string | null;
  job_listing_removed_at: string | null;
  job_listing_last_checked_at: string | null;
  job_listing_won_at: string | null;
  job_listing_lost_at: string | null;
  job_listing_ghosted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PipelineJob extends JobListing {
  application_id: string | null;
  application_stage: ApplicationStage | null;
  application_research_started_at: string | null;
  application_questions_started_at: string | null;
  application_evidence_started_at: string | null;
  application_resume_started_at: string | null;
  application_cover_letter_started_at: string | null;
  application_completed_at: string | null;
  application_sent_at: string | null;
  application_received_at: string | null;
  application_interviewing_at: string | null;
  application_offer_at: string | null;
  application_negotiating_at: string | null;
  pipeline_stage: PipelineStage;
}

export interface JobListingResearch {
  id: string;
  job_listing_id: string;
  user_id: string;
  prompt_text: string;
  raw_response: string;
  parsed_job: Record<string, unknown>;
  parsed_company: Record<string, unknown>;
  parsed_team: Record<string, unknown>;
  parsed_job_has_data: boolean;
  parsed_company_has_data: boolean;
  parsed_team_has_data: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobListingInterviewSupport {
  id: string;
  job_listing_id: string;
  user_id: string;
  prompt_text: string;
  raw_response: string;
  parsed_content: Record<string, unknown>;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  job_listing_id: string;
  application_stage: ApplicationStage;
  notes: string;
  metadata: Record<string, unknown>;
  application_research_started_at: string | null;
  application_questions_started_at: string | null;
  application_evidence_started_at: string | null;
  application_resume_started_at: string | null;
  application_cover_letter_started_at: string | null;
  application_completed_at: string | null;
  application_sent_at: string | null;
  application_received_at: string | null;
  application_interviewing_at: string | null;
  application_offer_at: string | null;
  application_negotiating_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationKeyword {
  id: string;
  application_id: string;
  user_id: string;
  keyword: string;
  category: KeywordCategory;
  origin_type: string;
  origin_user_keyword_id: string | null;
  is_reused: boolean;
  is_hidden: boolean;
  is_selected: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationQuestion {
  id: string;
  application_id: string;
  user_id: string;
  question_key: string;
  question_text: string;
  question_type: QuestionType;
  guidance: string;
  sort_order: number;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  target_keywords?: string[];
}

export interface ApplicationAnswer {
  id: string;
  application_id: string;
  user_id: string;
  application_question_id: string;
  source_user_answer_id: string | null;
  is_reused: boolean;
  answer_text: string;
  answer_summary: string;
  word_count: number;
  is_complete: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationEvidence {
  id: string;
  application_id: string;
  user_id: string;
  source_user_evidence_id: string | null;
  source_application_answer_id: string | null;
  title: string;
  resume_bullet: string;
  evidence_type: string;
  company: string;
  department: string;
  role: string;
  dates: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  metrics: string[];
  tools: string[];
  technologies: string[];
  skills: string[];
  keywords: string[];
  is_selected: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationResume {
  id: string;
  application_id: string;
  user_id: string;
  prompt_text: string;
  raw_response: string;
  edited_content: string;
  is_locked: boolean;
  is_accepted: boolean;
  accepted_at: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface ApplicationCoverLetter extends ApplicationResume {}

export interface WorkflowStage {
  key: ApplicationStage;
  label: string;
  description: string;
  href: (jobListingId: string) => string;
  order: number;
}

export interface PromptPack {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export type Job = PipelineJob;
export type PipelineStageKey = PipelineStage;
export type PacketWorkflowStageKey = ApplicationStage;
