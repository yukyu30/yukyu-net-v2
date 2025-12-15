export interface Signal {
  id: string;
  human_id: string;
  title: string;
  created_at: string;
}

export interface Human {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface StatusResponse {
  is_alive: boolean;
  last_seen_at: string;
  signal_count: number;
  recent_signals: Signal[];
  human: Human;
}
