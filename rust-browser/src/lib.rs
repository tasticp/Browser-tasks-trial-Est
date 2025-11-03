//! Minimal memory footprint browser engine
//! Cross-platform: iOS, Android, Windows, Linux, macOS

use std::sync::Arc;
use dashmap::DashMap;

mod engine;
mod memory;
mod tab;
mod navigation;

pub use engine::*;
pub use memory::*;
pub use tab::*;
pub use navigation::*;

/// Browser instance with minimal memory footprint
#[derive(Clone)]
pub struct Browser {
    tabs: Arc<DashMap<String, Tab>>,
    active_tab_id: Arc<std::sync::Mutex<Option<String>>>,
    engine: Arc<dyn Engine>,
    memory_pool: Arc<MemoryPool>,
}

impl Browser {
    /// Create new browser instance with memory pool
    pub fn new(engine_type: EngineType) -> Self {
        let engine = match engine_type {
            EngineType::Servo => Arc::new(engine::ServoEngine::new()),
            EngineType::WebKit => Arc::new(engine::WebKitEngine::new()),
        };

        Self {
            tabs: Arc::new(DashMap::new()),
            active_tab_id: Arc::new(std::sync::Mutex::new(None)),
            engine,
            memory_pool: Arc::new(MemoryPool::new()),
        }
    }

    /// Create a new tab with minimal memory allocation
    pub fn create_tab(&self, url: Option<String>) -> String {
        use std::time::{SystemTime, UNIX_EPOCH};
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let tab_id = format!("tab-{}-{}", timestamp, rand::random::<u32>());
        
        // Use memory pool for tab creation
        let tab = Tab::new(
            tab_id.clone(),
            url.unwrap_or_else(|| "about:blank".to_string()),
            self.memory_pool.clone(),
        );

        self.tabs.insert(tab_id.clone(), tab);
        
        *self.active_tab_id.lock().unwrap() = Some(tab_id.clone());
        tab_id
    }

    /// Close tab and free memory
    pub fn close_tab(&self, tab_id: &str) {
        if let Some((_, mut tab)) = self.tabs.remove(tab_id) {
            tab.cleanup();
        }
        
        // Update active tab if needed
        let mut active = self.active_tab_id.lock().unwrap();
        if *active == Some(tab_id.to_string()) {
            *active = self.tabs.iter().next().map(|e| e.key().clone());
        }
    }

    /// Navigate to URL with memory-efficient loading
    pub async fn navigate(&self, tab_id: &str, url: String) -> Result<(), String> {
        if let Some(mut tab) = self.tabs.get_mut(tab_id) {
            tab.load_url(url.clone()).await?;
            self.engine.load_url(tab_id, url).await?;
            Ok(())
        } else {
            Err("Tab not found".to_string())
        }
    }

    /// Get active tab
    pub fn active_tab(&self) -> Option<String> {
        self.active_tab_id.lock().unwrap().clone()
    }

    /// Get all tab IDs (zero-copy iterator)
    pub fn tab_ids(&self) -> Vec<String> {
        self.tabs.iter().map(|e| e.key().clone()).collect()
    }

    /// Get tab info
    pub fn get_tab(&self, tab_id: &str) -> Option<TabInfo> {
        self.tabs.get(tab_id).map(|tab| tab.info())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_browser_creation() {
        let browser = Browser::new(EngineType::Servo);
        assert!(browser.tabs.is_empty());
    }

    #[test]
    fn test_tab_creation() {
        let browser = Browser::new(EngineType::Servo);
        let tab_id = browser.create_tab(None);
        assert!(!tab_id.is_empty());
    }
}

