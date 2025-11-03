//! Memory-efficient tab management
//! Each tab uses minimal allocations

use serde::{Deserialize, Serialize};
use std::sync::Arc;
use crate::memory::MemoryPool;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TabInfo {
    pub id: String,
    pub url: String,
    pub title: String,
    pub is_loading: bool,
    pub can_go_back: bool,
    pub can_go_forward: bool,
    pub memory_bytes: usize,
}

/// Memory-efficient tab representation
pub struct Tab {
    id: String,
    url: String,
    title: String,
    is_loading: bool,
    can_go_back: bool,
    can_go_forward: bool,
    memory_pool: Arc<MemoryPool>,
    allocated_size: usize,
}

impl Tab {
    pub fn new(id: String, url: String, memory_pool: Arc<MemoryPool>) -> Self {
        // Track memory for tab metadata
        let size = id.len() + url.len() + 64; // +64 for other fields overhead
        let allocated = memory_pool.allocate(size);

        Self {
            id,
            url,
            title: String::new(),
            is_loading: false,
            can_go_back: false,
            can_go_forward: false,
            memory_pool,
            allocated_size: allocated,
        }
    }

    pub async fn load_url(&mut self, url: String) -> Result<(), String> {
        let old_url_size = self.url.len();
        self.url = url;
        let new_url_size = self.url.len();
        
        // Track memory delta
        let delta = new_url_size as i32 - old_url_size as i32;
        if delta > 0 {
            self.memory_pool.allocate(delta as usize);
        } else {
            self.memory_pool.deallocate((-delta) as usize);
        }
        self.allocated_size = (self.allocated_size as i32 + delta) as usize;

        self.is_loading = true;
        // Simulate loading
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        self.is_loading = false;
        Ok(())
    }

    pub fn set_title(&mut self, title: String) {
        let old_title_size = self.title.len();
        self.title = title;
        let new_title_size = self.title.len();
        
        let delta = new_title_size as i32 - old_title_size as i32;
        if delta > 0 {
            self.memory_pool.allocate(delta as usize);
        } else {
            self.memory_pool.deallocate((-delta) as usize);
        }
    }

    pub fn info(&self) -> TabInfo {
        TabInfo {
            id: self.id.clone(),
            url: self.url.clone(),
            title: self.title.clone(),
            is_loading: self.is_loading,
            can_go_back: self.can_go_back,
            can_go_forward: self.can_go_forward,
            memory_bytes: self.allocated_size,
        }
    }

    pub fn cleanup(&mut self) {
        // Deallocate tracked memory
        self.memory_pool.deallocate(self.allocated_size);
    }

    pub fn id(&self) -> &str {
        &self.id
    }

    pub fn url(&self) -> &str {
        &self.url
    }

    pub fn title(&self) -> &str {
        &self.title
    }
}

