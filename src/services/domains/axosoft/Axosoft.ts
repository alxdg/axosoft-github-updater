export interface BaseInterface {
  id: number;
}

export interface Aggregate {
  aggregate_duration_minutes: number;
  value: number;
  time_unit: [object]
}

export interface CustomFields {
  [name: string]: string;
}

export interface User extends BaseInterface {
  type: number;
  first_name: string;
  last_name: string;
}

export interface Workflow extends BaseInterface {
  workflow_step: BaseInterface;
  parent: BaseInterface;
  subitem_type: string;
  estimated_duration: Aggregate;
  actual_duration: Aggregate;
  remaining_duration: Aggregate;
  item_type: 'features' | 'bug';
  build_number: string;
  completion_date: null | Date;
  start_date: Date;
  name: string;
  project: BaseInterface;
  last_updated_by: BaseInterface;
  archived: boolean;
  reported_by: BaseInterface;
  assigned_to: BaseInterface;
  created_by: BaseInterface;
  reported_by_customer_contact: BaseInterface;
  created_by_email_address: null | string;
  publicly_viewable: boolean;
  due_date: null | Date;
  priority: BaseInterface;
  release: BaseInterface;
  status: BaseInterface;
  percent_complete: number;
  created_date_time: Date;
  last_updated_date_time: Date;
  description: string;
  notes: string;
  custom_fields: CustomFields
}

export interface WorkflowDetails {
  user: User;
  original: Workflow;
  changed: Workflow;
}


export interface WorkflowStep {
  id: number;
  order: number;
  name: string;
  enable_wip_limits: boolean;
  wip_items_per_step: number;
  enforce_wip_limits: boolean;
  enable_wip_limits_per_user: boolean;
  wip_items_per_user: number;
  color: string;
}