//! Navigation and history management with minimal memory

use serde::{Deserialize, Serialize};
use std::collections::VecDeque;

/// Memory-efficient navigation history
/// Uses circular buffer to limit memory usage
pub struct NavigationHistory {
    entries: VecDeque<HistoryEntry>,
    max_size: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HistoryEntry {
    pub url: String,
    pub title: String,
    pub timestamp: u64,
}

impl NavigationHistory {
    pub fn new(max_size: usize) -> Self {
        Self {
            entries: VecDeque::with_capacity(max_size),
            max_size,
        }
    }

    pub fn push(&mut self, url: String, title: String) {
        if self.entries.len() >= self.max_size {
            self.entries.pop_front();
        }
        
        self.entries.push_back(HistoryEntry {
            url,
            title,
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        });
    }

    pub fn get(&self, index: usize) -> Option<&HistoryEntry> {
        self.entries.get(index)
    }

    pub fn len(&self) -> usize {
        self.entries.len()
    }

    pub fn clear(&mut self) {
        self.entries.clear();
    }
}

impl Default for NavigationHistory {
    fn default() -> Self {
        Self::new(100) // Default 100 entries max
    }
}

